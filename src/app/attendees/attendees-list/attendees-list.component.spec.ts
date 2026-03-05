import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesListComponent } from './attendees-list.component';

describe('AttendeesListComponent', () => {
  let component: AttendeesListComponent;
  let fixture: ComponentFixture<AttendeesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendeesListComponent]
    });
    fixture = TestBed.createComponent(AttendeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
