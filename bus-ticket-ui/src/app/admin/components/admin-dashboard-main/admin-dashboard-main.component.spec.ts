import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardMainComponent } from './admin-dashboard-main.component';

describe('DashboardMainComponent', () => {
  let component: AdminDashboardMainComponent;
  let fixture: ComponentFixture<AdminDashboardMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
