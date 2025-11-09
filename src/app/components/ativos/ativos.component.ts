import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ativos',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, CalendarModule, FormsModule],
  templateUrl: './ativos.component.html',
  styleUrls: ['./ativos.component.scss']
})
export class AtivosComponent implements OnInit {
  ativosSeguranca: any[] = [];
  ativosRisco: any[] = [];
  diaSelecionado: Date | null = null;
  horaInicialSelecionada: Date | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregarMapa();
  }

  carregarMapa(): void {
    const dia = this.diaSelecionado ? this.formatarData(this.diaSelecionado) : this.formatarData(new Date());
    const horaInicial = this.horaInicialSelecionada ? this.formatarHora(this.horaInicialSelecionada) : '08:00';

    this.api.getMapaAtivos(dia, horaInicial).subscribe(data => {
      const agrupado: { [key: string]: { nome: string; tipo: string; alta: number; queda: number; neutro: number } } = {};

      data.forEach((item: any) => {
        if (!agrupado[item.nome]) {
          agrupado[item.nome] = { nome: item.nome, tipo: item.tipo, alta: 0, queda: 0, neutro: 0 };
        }
        if (item.sinal === 'Alta') agrupado[item.nome].alta += item.qtd;
        if (item.sinal === 'Queda') agrupado[item.nome].queda += item.qtd;
        if (item.sinal === 'Neutro') agrupado[item.nome].neutro += item.qtd;
      });

      const lista = Object.values(agrupado).map(a => {
        const score = a.alta - a.queda;
        let cor = '#bdbdbd'; // neutro
        if (a.alta > a.queda) cor = '#4caf50'; // verde
        else if (a.queda > a.alta) cor = '#ff4d4d'; // vermelho
        return { ...a, cor, score };
      });

      this.ativosSeguranca = lista.filter(a => a.tipo === 'seguranca');
      this.ativosRisco = lista.filter(a => a.tipo === 'risco');
    });
  }

  private formatarData(date: Date): string {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  }

  private formatarHora(date: Date): string {
    return date.toTimeString().split(' ')[0].substring(0, 5); // HH:mm
  }
}
