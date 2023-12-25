import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: any[], filterBy: string, filterKey: string): any[] {
    return items.filter(item => {
      const filterValue = item[filterKey].toLowerCase();
      filterBy = filterBy.toLocaleLowerCase();
      return filterValue.indexOf(filterBy) !== -1;
    });
  }
}
