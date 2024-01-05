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
  providers: [
    // (
    //   NgCircleProgressModule.forRoot({
    //     radius: 60,
    //     space: -10,
    //     outerStrokeGradient: true,
    //     outerStrokeWidth: 10,
    //     outerStrokeColor: '#4882c2',
    //     outerStrokeGradientStopColor: '#53a9ff',
    //     innerStrokeColor: '#e7e8ea',
    //     innerStrokeWidth: 10,
    //     animationDuration: 1000,
    //     startFromZero: true,
    //   }) as ModuleWithProviders<NgCircleProgressModule>
    // ).providers!,
  ],
})
export class CustomCircleProgressComponent {
  cd = inject(ChangeDetectorRef);
  // options = new CircleProgressOptions();
  // optionsA: CircleProgressOptions = {
  //   ...this.options,
  //   radius: 60,
  //   percent: 90,
  //   space: -10,
  //   outerStrokeGradient: true,
  //   outerStrokeWidth: 10,
  //   outerStrokeColor: '#4882c2',
  //   outerStrokeGradientStopColor: '#53a9ff',
  //   innerStrokeColor: '#e7e8ea',
  //   innerStrokeWidth: 10,
  //   title: 'UI2',
  //   animateTitle: false,
  //   animationDuration: 1000,
  //   showUnits: false,
  //   showBackground: false,
  //   clockwise: true,
  //   startFromZero: false,
  //   lazy: true,
  // };

  // @ViewChild(CircleProgressComponent, { static: true }) circleProgress!: CircleProgressComponent;

  // ngOnInit() {
  //   this.options = Object.assign({}, this.circleProgress.defaultOptions, this.optionsA);
  //   // this.cd.markForCheck();
  //   // this.cd.detectChanges();
  //   // this.circleProgress.ch
  // }

  // ngAfterViewInit(): void {
  //   this.options = Object.assign({}, this.circleProgress.defaultOptions, this.optionsA);
  //   this.cd.markForCheck();
  // }

  // copyOptions = (event: any, options: any) => {
  //   this.options = Object.assign({}, this.circleProgress.defaultOptions, options);
  // };
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
