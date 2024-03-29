import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { Subject, map, take, takeUntil, timer } from 'rxjs';
import { MinuteSecondsPipe } from 'src/app/pipes/seconds-to-minutes.pipe';

@Pipe({
  name: 'circleProgressPercentage',
  standalone: true,
})
export class CircleProgressPercentagePipe implements PipeTransform {
  transform(secondsLeft: any, totalTimeInSeconds: number): string {
    return Number((secondsLeft / totalTimeInSeconds) * 100).toFixed(2);
  }
}

@Component({
  selector: 'nl-circle-progress',
  standalone: true,
  imports: [CommonModule, MinuteSecondsPipe, CircleProgressPercentagePipe],
  templateUrl: './custom-circle-progress.component.html',
  styleUrls: ['./custom-circle-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCircleProgressComponent {
  private cd = inject(ChangeDetectorRef);

  totalTimeInSeconds: number = 0;

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

  @Output()
  onTimeover = new EventEmitter<boolean>();

  secondsLeft: number = 0;
  private destroyRef = new Subject();

  private startTimer() {
    const countdown$ = timer(0, 1000).pipe(
      take(this.totalTimeInSeconds + 1),
      map(secondsElapsed => this.totalTimeInSeconds - secondsElapsed),
      takeUntil(this.destroyRef)
    );

    countdown$.subscribe(secondsLeft => {
      this.secondsLeft = secondsLeft;
      if (this.secondsLeft === 0) {
        this.onTimeover.emit(true);
        this.destroyRef.complete();
      }
      this.cd.markForCheck();
    });
  }

  // getBgImg() {
  //   return (
  //     'background-image: conic-gradient(#0062f8 ' +
  //     Number((this.secondsLeft / this.totalTimeInSeconds) * 100).toFixed(2) +
  //     '%, rgb(238, 237, 237) 0deg)'
  //   );
  // }
}
