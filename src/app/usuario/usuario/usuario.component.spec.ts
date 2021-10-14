import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsarioComponent } from './usuario.component';

describe('UsarioComponent', () => {
  let component: UsarioComponent;
  let fixture: ComponentFixture<UsarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
