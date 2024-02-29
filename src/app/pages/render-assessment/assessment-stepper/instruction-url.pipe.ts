import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'instructionUrl',
  standalone: true,
})
export class InstructionUrlPipe implements PipeTransform {
  constructor() {}

  transform(instructionObj: { [key: string]: string } | null, selectedLanguage: string) {
    return instructionObj ? this.sanitizeGenInsPage(instructionObj[selectedLanguage]) : '';
  }

  private sanitizeGenInsPage(value: string) {
    return !value || (typeof value === 'object' && Object.keys(value).length === 0)
      ? 'about:blank'
      : value;
  }
}
