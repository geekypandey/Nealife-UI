import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, map } from 'rxjs';

export type VIEWPORT_TYPE = 'XSmall' | 'Small' | 'Medium' | 'Large' | 'XLarge' | 'XXLarge';

export const BootstrapBreakpoints = {
  XSmall: '(max-width: 575px)',
  Small: '(min-width: 576px) and (max-width: 767px)',
  Medium: '(min-width: 768px) and (max-width: 991px)',
  Large: '(min-width: 992px) and (max-width: 1199px)',
  XLarge: '(min-width: 1200px) and (max-width: 1399px)',
  XXLarge: '(min-width: 1400px)',
};

export const BootstrapBreakpointsUp = {
  XSmall: '(max-width: 575px)',
  SmallUp: '(min-width: 576px)',
  MediumUp: '(min-width: 768px)',
  LargeUp: '(min-width: 992px)',
  XLargeUp: '(min-width: 1200px)',
  XXLargeUp: '(min-width: 1400px)',
};

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private displayNameMap = new Map([
    [BootstrapBreakpoints.XSmall, 'XSmall'],
    [BootstrapBreakpoints.Small, 'Small'],
    [BootstrapBreakpoints.Medium, 'Medium'],
    [BootstrapBreakpoints.Large, 'Large'],
    [BootstrapBreakpoints.XLarge, 'XLarge'],
    [BootstrapBreakpoints.XXLarge, 'XXLarge'],
  ]);

  private currentViewportSize = new BehaviorSubject<null | VIEWPORT_TYPE>(null);

  constructor() {
    this.breakpointObserver
      .observe([
        BootstrapBreakpoints.XSmall,
        BootstrapBreakpoints.Small,
        BootstrapBreakpoints.Medium,
        BootstrapBreakpoints.Large,
        BootstrapBreakpoints.XLarge,
        BootstrapBreakpoints.XXLarge,
      ])
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          const viewportName: any = this.displayNameMap.get(query);
          if (result.breakpoints[query] && viewportName) {
            this.setViewPort(viewportName);
          }
        }
      });
  }

  private setViewPort(name: null | VIEWPORT_TYPE) {
    this.currentViewportSize.next(name);
  }

  get currentViewportName() {
    return this.currentViewportSize.asObservable();
  }

  // For exact match - observable
  get isXSmall$(): Observable<boolean> {
    return this.breakpointObserver.observe(BootstrapBreakpoints.XSmall).pipe(map(v => v.matches));
  }

  get isSmall$(): Observable<boolean> {
    return this.breakpointObserver.observe(BootstrapBreakpoints.Small).pipe(map(v => v.matches));
  }

  get isMedium$(): Observable<boolean> {
    return this.breakpointObserver.observe(BootstrapBreakpoints.Medium).pipe(map(v => v.matches));
  }

  // For up devices - observable
  get isSmallUp$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(BootstrapBreakpointsUp.SmallUp)
      .pipe(map(v => v.matches));
  }

  get isMediumUp$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(BootstrapBreakpointsUp.MediumUp)
      .pipe(map(v => v.matches));
  }

  get isLargeUp$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(BootstrapBreakpointsUp.LargeUp)
      .pipe(map(v => v.matches));
  }

  get isXLargeUp$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(BootstrapBreakpointsUp.XLargeUp)
      .pipe(map(v => v.matches));
  }

  get isXXLargeUp$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(BootstrapBreakpointsUp.XXLargeUp)
      .pipe(map(v => v.matches));
  }
}
