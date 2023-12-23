export function getDropdownOptions<T>(arr: T[], label: keyof T, value: keyof T) {
  return arr.map(obj => ({ label: obj[label], value: obj[value] }));
}
