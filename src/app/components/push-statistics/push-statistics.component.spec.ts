import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushStatisticsComponent } from './push-statistics.component';

describe('PushStatisticsComponent', () => {
  let component: PushStatisticsComponent;
  let fixture: ComponentFixture<PushStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
