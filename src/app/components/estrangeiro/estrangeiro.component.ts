import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estrangeiro',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Aba Estrangeiro</h2><p>Gráficos serão adicionados aqui.</p>`,
  styles: [`h2 { color: #42A5F5; }`]
})
export class EstrangeiroComponent {}
