import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeDialogComponent } from './attendee-dialog.component';

describe('AttendeeDialogComponent', () => {
  let component: AttendeeDialogComponent;
  let fixture: ComponentFixture<AttendeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendeeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
