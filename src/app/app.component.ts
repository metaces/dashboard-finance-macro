import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({

  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink,RouterLinkActive, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent {
  title = 'dashboard-finance';
    isLoading$;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
  }
}
