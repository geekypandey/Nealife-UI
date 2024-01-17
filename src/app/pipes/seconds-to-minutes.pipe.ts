import { Pipe, PipeTransform } from '@angular/core';
import { padStart } from '../util/util';

@Pipe({
  name: 'minuteSeconds',
  standalone: true,
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return padStart(minutes) + ':' + padStart(value - minutes * 60);
  }
}
