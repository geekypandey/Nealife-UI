// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APP_ROUTES } from './app/app-routes.constant';
import { AppComponent } from './app/app.component';
import { INTERCEPTORS } from './app/interceptors';

export function HttpLoaderFactory(http: HttpClient) {
  const timpestamp = new Date().getTime();
  return new TranslateHttpLoader(http, '/i18n/', `.json?buildTimestamp=` + timpestamp);
}

// platformBrowserDynamic().bootstrapModule(AppModule)
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideHttpClient(withInterceptors(INTERCEPTORS)),
    provideRouter([...APP_ROUTES], withComponentInputBinding()),
    MessageService,
    ConfirmationService,
    NgxSpinnerService,
  ],
}).catch(err => console.error(err));
