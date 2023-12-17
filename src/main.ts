// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app-routes.constant';
import { AppComponent } from './app/app.component';
import { AuthorizationInterceptor } from './app/interceptors/auth.interceptor';

// platformBrowserDynamic().bootstrapModule(AppModule)
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideHttpClient(withInterceptors([AuthorizationInterceptor])),
    provideRouter([...APP_ROUTES]),
  ],
}).catch(err => console.error(err));
