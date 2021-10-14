import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  constructor( private authenticationService: AuthenticationService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

  verificarVersao(){
    window.location.replace('/path');
    //location.reload(true);
    this.authenticationService.logout();
  }

}
