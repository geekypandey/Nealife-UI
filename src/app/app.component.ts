import { AsyncPipe, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
@Component({
  selector: 'nl-root',
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    SpinnerComponent,
    SidebarComponent,
    HeaderComponent,
    AsyncPipe,
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private translate = inject(TranslateService);

  constructor() {
    this.translate.setDefaultLang('en');

    // this.router.events
    //   .pipe(
    //     filter(event => event instanceof NavigationEnd),
    //     map(routerEvent => (<NavigationEnd>routerEvent).url.includes('render-assessment'))
    //   )
    //   .subscribe(value => {
    //     this.showAssessmentPage = value;
    //     if (!this.showAssessmentPage) {
    //       this.onPageLoad();
    //     }
    //   });
  }
}
