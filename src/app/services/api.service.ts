import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getLatestCotacoes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cotacoes/latest`);
  }

  getMinFerr(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/minfer`);
  }
}
