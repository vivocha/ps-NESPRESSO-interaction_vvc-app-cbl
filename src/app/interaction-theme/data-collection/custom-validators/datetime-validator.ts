import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

/**
 * Checks wheter the date and time chosen are valid or not.
 */
export function dateTimeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      const dateTime: DateTime = DateTime.fromISO(new Date(control.value).toISOString(), { zone: 'Europe/Rome' });
      const minDateTime: DateTime = DateTime.fromISO(new Date().toISOString(), { zone: 'Europe/Rome' });
      return !dateTime || (!!dateTime && dateTime <= minDateTime) ? { invalidDateTime: { value: control.value } } : null; // Invalidates the input value if the date and time chosen is in the past.
    }
    return null;
  };
}
