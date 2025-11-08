import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { WebSocketService } from '../../services/websocket.service';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico-checklist',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './grafico-checklist.component.html',
  styleUrls: ['./grafico-checklist.component.scss']
})
export class GraficoChecklistComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  loading = false;

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Alta', borderColor: '#66BB6A', fill: false, pointRadius: 0 }, // verde
      { data: [], label: 'Queda', borderColor: '#FF0000', fill: false, pointRadius: 0 }, // vermelho
      { data: [], label: 'Rastro Acumulado', borderColor: '#42A5F5', fill: false, borderDash: [5, 5], pointRadius: 0 } // azul pontilhado
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF' // texto branco para legenda
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#FFFFFF' },
        grid: { color: '#444' }
      },
      y: {
        ticks: { color: '#FFFFFF' },
        grid: { color: '#444' }
      }
    }
  };

  constructor(private wsService: WebSocketService) {}

  iniciarChecklist(): void {
    this.loading = true;
    this.wsService.connect().subscribe({
      next: data => {
        if (data.tipo === 'full') {
          // Resetar gráfico e carregar histórico completo
          this.chartData.labels = [];
          this.chartData.datasets.forEach(ds => ds.data = []);
          data.dados.forEach((bloco: any) => this.addBloco(bloco));
          this.loading = false; // histórico carregado
        } else if (data.tipo === 'incremento') {
          // Adicionar apenas o novo bloco
          this.addBloco(data.dados);
        }
        this.chart?.update();
      },
      error: () => {
        this.loading = false;
        alert('Erro ao conectar ao WebSocket.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private addBloco(bloco: any): void {
    this.chartData.labels?.push(new Date(bloco.fim).toLocaleTimeString());
    (this.chartData.datasets[0].data as number[]).push(parseFloat(bloco.alta));
    (this.chartData.datasets[1].data as number[]).push(parseFloat(bloco.queda));
    (this.chartData.datasets[2].data as number[]).push(parseFloat(bloco.rastro_acumulado));
  }
}
