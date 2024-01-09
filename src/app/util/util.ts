export function getDropdownOptions<T>(arr: T[], label: keyof T, value: keyof T) {
  return arr.map(obj => ({ label: obj[label], value: obj[value] }));
}

export function scrollIntoView(target: HTMLElement | null) {
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
  } else {
    console.error('target element is null : ', target);
  }
}

/**
 * Returns date in dd/mm/yyyy format
 *
 * @param value Date
 * @returns string
 */
export function DateToString(value: Date): string {
  let dd = value.getDate();
  let date = '';
  if (dd < 10) {
    date = '0' + dd;
  }
  let month = '';
  let mm = value.getMonth() + 1; // Months start at 0!
  if (mm < 10) {
    month = '0' + mm;
  }
  return date + '/' + month + '/' + value.getFullYear();
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
