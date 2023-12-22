// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APP_ROUTES } from './app/app-routes.constant';
import { AppComponent } from './app/app.component';
import { INTERCEPTORS } from './app/interceptors';

// platformBrowserDynamic().bootstrapModule(AppModule)
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideHttpClient(withInterceptors(INTERCEPTORS)),
    provideRouter([...APP_ROUTES]),
    MessageService,
    ConfirmationService,
    NgxSpinnerService,
  ],
}).catch(err => console.error(err));
