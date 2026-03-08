import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  constructor(private router: Router, private eventService: EventService) { }

  events: any;
  totalAttendees!: number;
  activePage!: number;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  paginatedEvents: any = [];
  selectedType: String = 'All';
  isLoading: boolean = false; //  Property to control loader visibility
  headers: any;
  ngOnInit() {
    this.itemsPerPage = window.innerWidth < 1000 ? 4 : 6;
    const token = localStorage.getItem('token'); // token saved after login
    if (!token) {
      console.error('No token found in localStorage!');
      alert("Login first")
      this.router.navigate([''])
    }

    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.loadEvents();
  }
  updateEventsList(newEvents: any[]) {
    this.events = newEvents;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
    this.updatePaginatedEvents();
    console.log("Parent component updated Event list:", this.events);
  }
  updatePaginatedEvents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    if (this.events) this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getAllEvents({ headers: this.headers }).pipe(
      finalize(() => {
        this.isLoading = false; // Hide loader after fetching events
      })
    ).subscribe({
      next: (events) => {
        this.events = events;
        console.log(this.events);

        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        alert('Failed to load events. Please try again.');
      }
    });


  }

  addEvent() {
    this.router.navigate(['add-event'])
  }

  updatePagination() {
    console.log('update pagination');
    this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Ensure currentPage is valid after potential deletion
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1; // Reset to 1 if no pages
    }

    if (this.events.length > 0) { // Only paginate if there are events
      this.paginatedEvents = this.events.slice(startIndex, endIndex);
      console.log('pagination applied');
    } else {
      this.paginatedEvents = []; // No events, so empty the paginated list
      console.log('no events to paginate');
    }
  }

  goToPage(event: Event, page: number) {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) { // Ensure page is within bounds
      this.currentPage = page;
      this.updatePagination();
    }
  }

  goToPreviousPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // editEvent(id: number) {
  //   console.log(id)
  //   this.router.navigate(['/update-event']);
  // }



  viewDetails(event: any) {
    this.router.navigate(['/event', event.event_id])

  }

  deleteEvent(id: number) {
    if (confirm(`Are you sure you want to delete this event? This action cannot be undone.`)) {
      this.isLoading = true; // Show loader during deletion
      this.eventService.deleteEvent(id, { headers: this.headers }).pipe(
        finalize(() => {
          this.isLoading = false; // Hide loader after completion
        })
      ).subscribe({
        next: () => {
          alert("event deleted successfully!");
          // Remove the deleted event from the local array and update pagination
          this.loadEvents()
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting event:', error);
          let errorMessage = 'Failed to delete event.';
          if (error.error?.message) {
            errorMessage += ' ' + error.error.message;
          } else if (typeof error.error === 'string') {
            errorMessage += ' ' + error.error;
          } else if (error.message) {
            errorMessage += ' ' + error.message;
          }
          alert(errorMessage);
        }
      });
    }
  }
  filterByType() {
    console.log(this.selectedType);
    if (!this.selectedType || this.selectedType === '') {
      this.updatePagination(); 
      return;
    }
    if (this.selectedType == "All") {
      this.loadEvents();
      return;
    }
    // Filter events by type
    const filteredEvents = this.events.filter(
      (elem: any) => elem.event_type === this.selectedType
    );

    // Update paginatedEvents with filtered list
    this.totalPages = Math.ceil(filteredEvents.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    this.currentPage = 1; // reset to first page after filter
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  }
}
