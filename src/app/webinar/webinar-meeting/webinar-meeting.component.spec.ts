import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarMeetingComponent } from './webinar-meeting.component';

describe('WebinarMeetingComponent', () => {
  let component: WebinarMeetingComponent;
  let fixture: ComponentFixture<WebinarMeetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebinarMeetingComponent]
    });
    fixture = TestBed.createComponent(WebinarMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
