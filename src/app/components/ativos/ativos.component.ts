import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ativos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ativos.component.html',
  styleUrls: ['./ativos.component.scss']
})
export class AtivosComponent implements OnInit {
  ativos: any[] = [];
  sinais: string[] = [];
  alta = 0;
  queda = 0;
  neutro = 0;

  // Valores de referência (equivalentes a RC7 e RC8 no VBA)
  minRange = -0.05; // ajuste conforme lógica original
  maxRange = 0.05;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getLatestCotacoes().subscribe(data => {
      this.ativos = data;
      this.calcularSinais();
    });
  }

  calcularSinais(): void {
    this.sinais = [];
    for (let i = 1; i < this.ativos.length; i++) {
      const diff = this.ativos[i].preco - this.ativos[i - 1].preco;
      let sinal = '';
      if (diff >= this.minRange && diff <= this.maxRange) {
        sinal = 'n';
      } else if (diff > this.maxRange) {
        sinal = '+';
      } else {
        sinal = '-';
      }
      this.sinais.push(sinal);
    }

    this.alta = this.sinais.filter(s => s === '+').length;
    this.queda = this.sinais.filter(s => s === '-').length;
    this.neutro = this.sinais.filter(s => s === 'n').length;
  }
}
