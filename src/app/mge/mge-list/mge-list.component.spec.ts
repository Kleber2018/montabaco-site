import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgeListComponent } from './mge-list.component';

describe('SolicitacaoListComponent', () => {
  let component: MgeListComponent;
  let fixture: ComponentFixture<MgeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
