import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WildCardComponent } from './wild-card.component';

describe('WildCardComponent', () => {
  let component: WildCardComponent;
  let fixture: ComponentFixture<WildCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WildCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WildCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
