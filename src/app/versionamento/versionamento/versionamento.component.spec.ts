import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionamentoComponent } from './versionamento.component';

describe('VersionamentoComponent', () => {
  let component: VersionamentoComponent;
  let fixture: ComponentFixture<VersionamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
