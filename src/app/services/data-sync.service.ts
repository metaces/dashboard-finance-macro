import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DataSyncService {
  private cotacoesSubject = new BehaviorSubject<any[]>([]);
  cotacoes$ = this.cotacoesSubject.asObservable();

  constructor(private api: ApiService) {
    // Atualiza a cada 5 minutos
    interval(120000)
      .pipe(switchMap(() => this.api.getLatestCotacoes()))
      .subscribe(data => this.cotacoesSubject.next(data));

    // Carrega dados iniciais
    this.api.getLatestCotacoes().subscribe(data => this.cotacoesSubject.next(data));
  }
}
