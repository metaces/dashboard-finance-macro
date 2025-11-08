import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket!: WebSocket;

  connect(params: { dia: string; horaInicial: string }): Observable<any> {
    return new Observable(observer => {
      this.socket = new WebSocket('ws://localhost:8080');

      this.socket.onopen = () => {
        console.log('Conectado ao WebSocket');
        // Enviar parâmetros para o servidor
        this.socket.send(JSON.stringify(params));
      };

      this.socket.onmessage = event => {
        const data = JSON.parse(event.data);
        observer.next(data);
      };

      this.socket.onerror = err => observer.error(err);
      this.socket.onclose = () => observer.complete();

      return () => this.socket.close();
    });
  }
}
