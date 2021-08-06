import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallangesComponent } from './challanges.component';

describe('ChallangesComponent', () => {
  let component: ChallangesComponent;
  let fixture: ComponentFixture<ChallangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
