import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { WebSocketService } from '../../services/websocket.service';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico-checklist',
  standalone: true,
  imports: [CommonModule, NgChartsModule, CalendarModule, ButtonModule, FormsModule],
  templateUrl: './grafico-checklist.component.html',
  styleUrls: ['./grafico-checklist.component.scss']
})
export class GraficoChecklistComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  loading = false;
  diaSelecionado: Date | null = null;
  horaInicialSelecionada: Date | null = null;

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Alta', borderColor: '#66BB6A', fill: false, pointRadius: 0 },
      { data: [], label: 'Queda', borderColor: '#FF0000', fill: false, pointRadius: 0 },
      { data: [], label: 'Rastro Acumulado', borderColor: '#42A5F5', fill: false, borderDash: [5, 5], pointRadius: 0 }
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#FFFFFF' }, display: false
      }
    },
    scales: {
      x: { ticks: { color: '#FFFFFF' }, grid: { color: '#444' } },
      y: { ticks: { color: '#FFFFFF' }, grid: { color: '#444' } }
    }
  };

  constructor(private wsService: WebSocketService) {}

  iniciarChecklist(): void {
    if (!this.diaSelecionado || !this.horaInicialSelecionada) {
      alert('Selecione o dia e a hora inicial.');
      return;
    }

    const dia = this.formatDate(this.diaSelecionado);
    const horaInicial = this.formatTime(this.horaInicialSelecionada);

    this.loading = true;
    this.wsService.connect({ dia, horaInicial }).subscribe({
      next: data => {
        if (data.tipo === 'full') {
          this.chartData.labels = [];
          this.chartData.datasets.forEach(ds => ds.data = []);
          data.dados.forEach((bloco: any) => this.addBloco(bloco));
          this.loading = false;
        } else if (data.tipo === 'incremento') {
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

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  private formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0].substring(0, 5); // HH:mm
  }
}
