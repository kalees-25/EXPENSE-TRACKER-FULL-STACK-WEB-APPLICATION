import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  confirmDelete(title: string, text: string):Promise<SweetAlertResult<any> >
  {

  return Swal.fire({

    title,

    text,

    icon: 'warning',

    showCancelButton: true,

    confirmButtonText: 'Delete',

    cancelButtonText: 'Cancel',

    reverseButtons: true,

    buttonsStyling: false,

    background: '#0f172a',

    color: '#e5e7eb',

    iconColor: '#f59e0b',

    customClass: {

      popup:
        'rounded-2xl shadow-2xl border border-slate-700',

      title:
        'text-xl font-semibold',

      htmlContainer:
        'text-sm text-slate-300',

      actions:
        'gap-3',

      confirmButton:
        'px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700',

      cancelButton:
        'px-4 py-2 rounded-xl bg-slate-700 text-slate-100 font-medium hover:bg-slate-600',

    }

  });

}



  success(
  title: string,
  text?: string
) {


  return Swal.fire({

    title,

    text,

    icon: 'success',

    toast: true,

    position: 'top-end',

    timer: 2000,

    showConfirmButton: false,

    background: '#ecfdf5',

    color: '#065f46',

    iconColor: '#10b981'

  });

}

  

error(
  title: string,
  text?: string
) {

  return Swal.fire({

    title,

    text,

    icon: 'error',

    buttonsStyling: false,

    background: '#0f172a',

    color: '#e5e7eb',

    confirmButtonText: 'OK',

    customClass: {

      popup:
        'rounded-2xl shadow-2xl border border-red-900',

      title:
        'text-xl font-semibold',

      confirmButton:
        'px-4 py-2 rounded-xl bg-red-600 text-white font-medium'

    }

  });

}


toastSuccess(
  message: string
) {

  return Swal.fire({

    toast: true,

    position: 'top-end',

    showConfirmButton: false,

    timer: 1800,

    timerProgressBar: true,

    icon: 'success',

    title: message

  });

}

}