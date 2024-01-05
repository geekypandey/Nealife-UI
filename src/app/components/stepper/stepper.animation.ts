import {
  AnimationTriggerMetadata,
  animate,
  animateChild,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const DEFAULT_HORIZONTAL_ANIMATION_DURATION = '500ms';
export const DEFAULT_VERTICAL_ANIMATION_DURATION = '225ms';

export const matStepperAnimations: {
  readonly horizontalStepTransition: AnimationTriggerMetadata;
  readonly verticalStepTransition: AnimationTriggerMetadata;
  readonly stepTransitionNext: AnimationTriggerMetadata;
  readonly stepTransitionPrev: AnimationTriggerMetadata;
  readonly slideInOut: AnimationTriggerMetadata;
} = {
  slideInOut: trigger('slideInOut', [
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('500ms ease-in-out', style({ transform: 'translateX(0%)' })),
    ]),
    transition(':leave', [animate('500ms ease-in-out', style({ transform: 'translateX(-100%)' }))]),
  ]),
  stepTransitionNext: trigger('stepTransitionNext', [
    state('next', style({ transform: 'translate3d(-100%, 0, 0)' })),
    transition(
      '* => *',
      group([
        animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
        query('@*', animateChild(), { optional: true }),
      ]),
      {
        params: { animationDuration: DEFAULT_HORIZONTAL_ANIMATION_DURATION },
      }
    ),
  ]),
  stepTransitionPrev: trigger('stepTransitionPrev', [
    state('previous', style({ transform: 'translate3d(100%, 0, 0)' })),
    transition(
      '* => *',
      group([
        animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
        query('@*', animateChild(), { optional: true }),
      ]),
      {
        params: { animationDuration: DEFAULT_HORIZONTAL_ANIMATION_DURATION },
      }
    ),
  ]),

  horizontalStepTransition: trigger('horizontalStepTransition', [
    state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
    state('current', style({ transform: 'none', visibility: 'inherit' })),
    state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
    transition(
      '* => *',
      group([
        animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
        query('@*', animateChild(), { optional: true }),
      ]),
      {
        params: { animationDuration: DEFAULT_HORIZONTAL_ANIMATION_DURATION },
      }
    ),
  ]),

  verticalStepTransition: trigger('verticalStepTransition', [
    state('previous', style({ height: '0px', visibility: 'hidden' })),
    state('next', style({ height: '0px', visibility: 'hidden' })),
    state('current', style({ height: '*', visibility: 'inherit' })),
    transition(
      '* <=> current',
      group([
        animate('{{animationDuration}} cubic-bezier(0.4, 0.0, 0.2, 1)'),
        query('@*', animateChild(), { optional: true }),
      ]),
      {
        params: { animationDuration: DEFAULT_VERTICAL_ANIMATION_DURATION },
      }
    ),
  ]),
};
