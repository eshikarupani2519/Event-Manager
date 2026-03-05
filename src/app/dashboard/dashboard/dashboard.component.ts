import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { DashboardService } from '../dashboard.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  totalEvents: number | undefined;
  meetUps: number | undefined;
  conferences: number | undefined;
  workShops: number | undefined;

  constructor(private dashboardService: DashboardService, private router: Router) { }
  ngOnInit() {
    const token: string | null = localStorage.getItem('token'); // token saved after login
    if (!token) {
      console.error('No token found in localStorage!');

      alert("Login first")
      this.router.navigate([''])

    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Fetch data for all charts from dashboard endpoint
    this.dashboardService.getStats({ headers }).subscribe((stats: any) => {
      console.log(stats);
      this.totalEvents = stats.dashboard.totalEvents;
      this.meetUps = stats.dashboardChart.meetUps;
      this.conferences = stats.dashboardChart.conferences;
      this.workShops = stats.dashboardChart.workShops;
      this.createMainBoardIpoChart();
    });
  }

  createMainBoardIpoChart(): void {
    const ctx = document.getElementById('mainBoardIpoChart') as HTMLCanvasElement;
    console.log('Canvas element found:', ctx);
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Workshops', 'Meetups', 'Conferences'],
          datasets: [{
            data: [this.workShops, this.meetUps, this.conferences],
            backgroundColor: [
              '#8593ED', //  Workshops
              ' #c55acfff ', //  Meetups
              ' #87faa0ff'  // Conferences
            ],
            hoverBackgroundColor: [
              '#6c7ff7ff',
              ' #a62bb1ff ',
              ' #49ff70ff'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Hide the default legend as we have a custom one
            },
            tooltip: {
              enabled: true
            }
          },
          cutout: '80%'
        }
      }
      )
    };
  }
}

