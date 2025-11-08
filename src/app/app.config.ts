import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoadingInterceptorService } from './interceptors/loading-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router setup with scrolling and navigation options
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation()
    ),

    // Enable Fetch API for HTTP client
    provideHttpClient(withInterceptors([LoadingInterceptorService])),

    // Enable animations
    provideAnimationsAsync(),

    // PrimeNG theme setup
    providePrimeNG({
      theme: {
        preset: Aura, // Select the PrimeNG Aura theme (or other available themes)
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          },
          darkModeSelector: '.app-dark' // Enables dark mode toggle with the given selector
        }
      }
    })
  ]
  // providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
