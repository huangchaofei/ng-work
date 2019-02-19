import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellCoverComponent } from './well-cover.component';

describe('WellCoverComponent', () => {
  let component: WellCoverComponent;
  let fixture: ComponentFixture<WellCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
