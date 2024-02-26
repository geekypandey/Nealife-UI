import { FormGroup } from '@angular/forms';

export function getDropdownOptions<T>(arr: T[], label: keyof T, value: keyof T) {
  return arr.map(obj => ({ label: obj[label], value: obj[value] }));
}

export function scrollIntoView(target: HTMLElement | null, scrollOptions?: ScrollIntoViewOptions) {
  if (target) {
    const options: ScrollIntoViewOptions = {
      behavior: 'smooth',
      ...scrollOptions,
    };
    target.scrollIntoView(options);
  } else {
    console.error('target element is null : ', target);
  }
}

/**
 * Add prefix to number if it's single digit.
 *
 * @param value number
 * @returns string
 */
export function padStart(value: number, maxLength: number = 2, prefix: string = '0') {
  return `${value}`.padStart(maxLength, prefix);
}

/**
 * Returns date in dd/mm/yyyy format
 *
 * @param value Date
 * @returns string
 */
export function DateToString(value: Date): string {
  if (!value) return '';
  const dd = padStart(value.getDate());
  const mm = padStart(value.getMonth() + 1); // Months start at 0!
  return `${dd}/${mm}/${value.getFullYear()}`;
}

/**
 * Converts date string formatted(dd/mm/yyyy) to Date object.
 *
 * @param value string
 * @returns Date
 */
export function StringToDate(value: string): Date {
  const [dd, mm, yyyy] = value.split('/');
  const dateString = [mm, dd, yyyy].join('/');
  return new Date(dateString);
}

/**
 * Returns current date and time in dd/mm/yyyy hh:mm:ss format
 *
 * @returns string
 */
export function getCurrentTime(): string {
  const d = new Date();
  const hh = d.getHours();
  const mm = d.getMinutes();
  const ss = d.getSeconds();
  return `${DateToString(d)} ${padStart(hh)}:${padStart(mm)}:${padStart(ss)}`;
}

/**
 * To check empty object
 */
export function isEmptyObject(obj: Object) {
  return Object.keys(obj).length === 0;
}

/**
 * Mark all controls under formGroup as dirty.
 */
export function markFormGroupDirty(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    if (control instanceof FormGroup) {
      markFormGroupDirty(control);
    } else {
      control.markAsDirty();
    }
  });
}
