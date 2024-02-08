import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: any[], searchText: string, fieldName: string): any[] {
    console.info(items);
    return items.filter(item => {
      const filterValue = item[fieldName].toLowerCase();
      searchText = searchText.toLocaleLowerCase();
      return filterValue.indexOf(searchText) !== -1;
    });
  }
}
