import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoFormComponent } from './solcitacao-form.component';

describe('SolicitacaoFormComponent', () => {
  let component: SolicitacaoFormComponent;
  let fixture: ComponentFixture<SolicitacaoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitacaoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitacaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
