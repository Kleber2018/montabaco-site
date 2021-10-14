import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgeDashboardComponent } from './mge-dashboard.component';

describe('EmpresaDashboardComponent', () => {
  let component: MgeDashboardComponent;
  let fixture: ComponentFixture<MgeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
