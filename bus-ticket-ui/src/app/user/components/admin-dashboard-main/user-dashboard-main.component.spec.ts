import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardMainComponent } from './user-dashboard-main.component';

describe('UserDashboardMainComponent', () => {
  let component: UserDashboardMainComponent;
  let fixture: ComponentFixture<UserDashboardMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDashboardMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDashboardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
