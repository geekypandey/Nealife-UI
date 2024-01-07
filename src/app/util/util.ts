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
