import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComeBackButtonComponent } from './come-back-button.component';

describe('ComeBackButtonComponent', () => {
  let component: ComeBackButtonComponent;
  let fixture: ComponentFixture<ComeBackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComeBackButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComeBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
