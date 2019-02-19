import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmStatisticsComponent } from './alarm-statistics.component';

describe('AlarmStatisticsComponent', () => {
  let component: AlarmStatisticsComponent;
  let fixture: ComponentFixture<AlarmStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
