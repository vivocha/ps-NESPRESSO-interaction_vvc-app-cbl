import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

/**
 * Checks whether the date and the time chosen are valid or not.
 */
export function dateTimeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let outsideWorkingHours: boolean = false;
      const dateTime: DateTime = DateTime.fromISO(new Date(control.value).toISOString(), { zone: 'Europe/Rome' });
      const minDateTime: DateTime = DateTime.fromISO(new Date().toISOString(), { zone: 'Europe/Rome' });
      const dateTimeHours: string = dateTime.toString().substring(dateTime.toString().length, 11).substring(0, 2);
      outsideWorkingHours = ((parseInt(dateTimeHours) >= 22) || (parseInt(dateTimeHours) <= 7)) ? true : false;
      return !dateTime || (!!dateTime && dateTime <= minDateTime) || !!outsideWorkingHours ? { invalidDateTime: { value: control.value } } : null; // Returns an error if the date and/or the time chosen are in the past.
    }
    return null;
  };
}