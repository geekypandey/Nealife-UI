import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { Subject, map, take, takeUntil, timer } from 'rxjs';

/**
 * Add 0 as prefix to number if it's single digit.
 *
 * @param value number
 * @returns string
 */
const padStart = (value: number): string => {
  return `${value}`.padStart(2, '0');
};
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

@Component({
  selector: 'nl-circle-progress',
  standalone: true,
  imports: [CommonModule, MinuteSecondsPipe],
  templateUrl: './custom-circle-progress.component.html',
  styleUrls: ['./custom-circle-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCircleProgressComponent {
  private cd = inject(ChangeDetectorRef);

  private totalTimeInSeconds: number = 0;

  @Input()
  set timeInMinutes(value: number) {
    if (value > 0) {
      this.destroyRef = new Subject(); // re-create when new time re-assigned
      this.totalTimeInSeconds = value * 60;
      this.startTimer();
    }
  }

  @Input()
  stopTimer: boolean = false;

  secondsLeft: number = 0;
  private destroyRef = new Subject();

  private startTimer() {
    const countdown$ = timer(0, 1000).pipe(
      take(this.totalTimeInSeconds),
      map(secondsElapsed => this.totalTimeInSeconds - secondsElapsed),
      takeUntil(this.destroyRef)
    );

    countdown$.subscribe(secondsLeft => {
      this.secondsLeft = secondsLeft;
      if (this.secondsLeft === 0) {
        this.destroyRef.complete();
      }
      this.cd.markForCheck();
    });
  }

  getBgImg() {
    return (
      'background-image: conic-gradient(#0062f8 ' +
      Number((this.secondsLeft / this.totalTimeInSeconds) * 100).toFixed(2) +
      '%, rgb(238, 237, 237) 0deg)'
    );
  }
}
