import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';


export function  matchFieldsValidator(
  field: string ,
  confirmField: string
): ValidatorFn {

    //  anonymous function
  return (
    control: AbstractControl
  ): ValidationErrors | null => {

// -----------------------------------------------------------------------
    // ?. optional chaining -> safe property access , no crash 
// ---------------------------------------------------------------------
    const firstValue =
      control.get(field)?.value;

    const secondValue =
      control.get(confirmField)?.value;


    if (!firstValue || !secondValue) {

      return null;

    }


    return firstValue === secondValue

      ? null

      : {
          fieldsMismatch: true
        };

  };

}