import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../events/event.service';

@Component({
  selector: 'app-checkin-form',
  templateUrl: './checkin-form.component.html',
  styleUrls: ['./checkin-form.component.css']
})
export class CheckinFormComponent implements OnInit {
  eventId: string | null = null;
  attendeeName: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
  }

  checkIn() {
    if (!this.attendeeName || !this.eventId) return;

    this.eventService.checkInAttendee(this.eventId, this.attendeeName).subscribe({
      next: (res: any) => {
        this.message = res.message;
      },
      error: (err:any) => {
        this.message = 'Error checking in';
        console.error(err);
      }
    });
  }
}