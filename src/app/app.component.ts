import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SpinnerComponent } from './components/spinner/spinner.component';
@Component({
  selector: 'nl-root',
  standalone: true,
  imports: [RouterModule, ToastModule, ConfirmDialogModule, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Nealife';

  private translate = inject(TranslateService);

  constructor() {
    this.translate.setDefaultLang('en');
  }
}
