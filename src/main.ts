// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app-routes.constant';


// platformBrowserDynamic().bootstrapModule(AppModule)
bootstrapApplication(AppComponent,
  {
    providers: [
      importProvidersFrom(BrowserModule),
      provideHttpClient(withInterceptorsFromDi()),
      provideRouter(
        [
          ...APP_ROUTES
        ]
      ) 
    ]
  })
  .catch(err => console.error(err));
