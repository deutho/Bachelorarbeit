import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallangeRewardAlertComponent } from './challange-reward-alert.component';

describe('ChallangeRewardAlertComponent', () => {
  let component: ChallangeRewardAlertComponent;
  let fixture: ComponentFixture<ChallangeRewardAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallangeRewardAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallangeRewardAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
