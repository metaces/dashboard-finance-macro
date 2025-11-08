import { inject, Injectable } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize, Observable } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';

export const LoadingInterceptorService: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService); // Inject LoadingService in function
  loadingService.show(); // Show spinner

  return next(req).pipe(
    finalize(() => loadingService.hide()) // Hide spinner after request completes
  );
};
