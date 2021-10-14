import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
// import { OneSignalService } from 'ngx-onesignal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  constructor( ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
