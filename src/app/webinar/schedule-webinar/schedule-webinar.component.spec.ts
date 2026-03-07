import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleWebinarComponent } from './schedule-webinar.component';

describe('ScheduleWebinarComponent', () => {
  let component: ScheduleWebinarComponent;
  let fixture: ComponentFixture<ScheduleWebinarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleWebinarComponent]
    });
    fixture = TestBed.createComponent(ScheduleWebinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
