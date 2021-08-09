import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassgoalComponent } from './classgoal.component';

describe('ClassgoalComponent', () => {
  let component: ClassgoalComponent;
  let fixture: ComponentFixture<ClassgoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassgoalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassgoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
