import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-come-back-button',
  templateUrl: './come-back-button.component.html',
  styleUrls: ['./come-back-button.component.css']
})
export class ComeBackButtonComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  @Output() public comeBackEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

  public comeBack(): void {
    this.comeBackEvent.emit();
  }
}
