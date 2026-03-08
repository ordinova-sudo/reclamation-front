import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },provideZoneChangeDetection({ eventCoalescing: true }),provideAnimations(), provideRouter(routes), provideClientHydration(),  provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()]
};
