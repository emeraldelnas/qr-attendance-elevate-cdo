import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanPcComponent } from './scan-pc.component';

describe('ScanPcComponent', () => {
  let component: ScanPcComponent;
  let fixture: ComponentFixture<ScanPcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanPcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanPcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
