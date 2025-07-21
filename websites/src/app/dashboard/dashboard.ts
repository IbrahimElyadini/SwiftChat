import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Analytics } from '../analytics';
import { ChartType, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private analytics = inject(Analytics);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  isBrowser = false;
  selectedChart: string = 'messages';

  // Chart data storage
  chartDataMap: { [key: string]: ChartData } = {};

  // All chart configurations
  chartOptions: { id: string; label: string; type: ChartType, fetch: () => Observable<any>, labelName: string }[] = [
    { id: 'messages', label: 'Messages per day', type: 'bar', fetch: () => this.analytics.getMessagesPerDay(), labelName: 'Messages' },
    { id: 'logins', label: 'Connections per day', type: 'line', fetch: () => this.analytics.getLoginsPerDay(), labelName: 'Connections' },
    { id: 'registrations', label: 'Registrations per day', type: 'bar', fetch: () => this.analytics.getRegistrationsPerDay(), labelName: 'Registrations' },
    { id: 'profileUpdates', label: 'Profile updates', type: 'bar', fetch: () => this.analytics.getProfileUpdatesPerDay(), labelName: 'Profile Updates' },
    { id: 'deletions', label: 'Account deleted', type: 'bar', fetch: () => this.analytics.getDeletionsPerDay(), labelName: 'Deleted Account' },
    { id: 'perUser', label: 'Messages per user', type: 'bar', fetch: () => this.analytics.getMessagesPerUser(), labelName: 'Messages / user' },
    { id: 'perConversation', label: 'Messages per conversation', type: 'bar', fetch: () => this.analytics.getMessagesPerConversation(), labelName: 'Messages / Conversation' },
    { id: 'activeUsers', label: 'Active Users per day', type: 'bar', fetch: () => this.analytics.getActiveUsersPerDay(), labelName: 'active users' },
    { id: 'hourly', label: 'Messages per hour', type: 'line', fetch: () => this.analytics.getMessagesPerHour(), labelName: 'Messages / hour' },
  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = sessionStorage.getItem('username');
      if (storedId === 'admin') {
        this.isBrowser = true;
        this.loadAllChartData();
      } else {
        window.location.href = '/';
      }
    }
  }

  loadAllChartData() {
    this.chartOptions.forEach(opt => {
      opt.fetch().subscribe(data => {
        this.chartDataMap[opt.id] = this.formatChartData(data, opt.labelName, opt.type);
        this.cdr.detectChanges();
      });
    });
  }

  formatChartData(
    data: Record<string, number>,
    label: string,
    type: ChartType
  ): ChartData {
    const labels = Object.keys(data);
    const values = Object.values(data);

    return {
      labels,
      datasets: [
        {
          type,
          label,
          data: values,
          borderWidth: 1,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
        } as any
      ]
    };
  }
}
