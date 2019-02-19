import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerMapComponent } from './worker-map.component';

describe('WorkerMapComponent', () => {
  let component: WorkerMapComponent;
  let fixture: ComponentFixture<WorkerMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
