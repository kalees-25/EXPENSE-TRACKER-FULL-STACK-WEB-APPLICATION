import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { jwtDecode, JwtPayload } from 'jwt-decode';

import { environment } from '../../../../../environments/environment';

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
} from '../../../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ---------------- API URL ----------------

  private readonly apiURL = `${environment.apiBaseUrl}/auth`;

  // ---------------- STORAGE KEYS ----------------

  private readonly TOKEN_KEY = 'access_token';

  // ---------------- AUTH STATE ----------------

  private readonly authStateSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  // PUBLIC READ-ONLY AUTH STATE

  isAuthenticated$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ==================================================
  //                  REGISTER
  // ==================================================

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiURL}/register`, payload);
  }

  // ==================================================
  // LOGIN
  // ==================================================

  login(payload: LoginRequest): Observable<AuthResponse> {
    const body = new URLSearchParams(); //  URLSearchParams ->  CREATES FORM DATA STYLE BODY

    body.set('username', payload.email);

    body.set('password', payload.password);

    return this.http
      .post<AuthResponse>(`${this.apiURL}/login`, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        tap((response) => {
          this.setToken(response.access_token);

          this.authStateSubject.next(true);
        }),
      );
  }

  // ==================================================
  // LOGOUT
  // ==================================================

  logout(): void {
    // REMOVE TOKEN

    localStorage.removeItem(this.TOKEN_KEY);

    // UPDATE AUTH STATE

    this.authStateSubject.next(false);
  }

  // ==================================================
  // TOKEN METHODS
  // ==================================================

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ==================================================
  // AUTH CHECK
  // ==================================================

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  // ==================================================
  // TOKEN VALIDATION
  // ==================================================

  private hasValidToken(): boolean {
    const token = this.getToken();

    // NO TOKEN

    if (!token) {
      return false;
    }

    try {
      // DECODE JWT

      const decoded = jwtDecode<JwtPayload>(token);

      // CURRENT TIME IN SECONDS

      const currentTime = Date.now() / 1000;

      // TOKEN EXPIRED

      if (!decoded.exp || decoded.exp < currentTime) {
        
        localStorage.removeItem(this.TOKEN_KEY)

        return false;
      }

      return true;
    } catch {
      // INVALID TOKEN

      localStorage.removeItem(this.TOKEN_KEY)

      return false;
    }
  }
}
