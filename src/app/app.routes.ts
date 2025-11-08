import { Routes } from '@angular/router';
import { GraficoChecklistComponent } from './components/grafico-checklist/grafico-checklist.component';
import { AtivosComponent } from './components/ativos/ativos.component';

export const routes: Routes = [
  { path: '', component: GraficoChecklistComponent },
  { path: 'ativos', component: AtivosComponent },
  { path: 'estrangeiro', loadComponent: () => import('./components/estrangeiro/estrangeiro.component').then(m => m.EstrangeiroComponent) }
];
