import { AbstractControl, ValidatorFn } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function phoneNumberValidator(country): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      const phoneNumber = control.value;
      const phone = parsePhoneNumberFromString(phoneNumber, country.toUpperCase());
      return !phone || (phone && !phone.isValid()) ? { invalidPhoneNumber: { value: control.value } } : null;
    }
    return null;
  };
}
