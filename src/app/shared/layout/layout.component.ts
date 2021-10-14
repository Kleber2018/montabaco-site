import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

/**Angular Material. */
import { MatSidenav, MatDrawer } from '@angular/material/sidenav';

/**Models.*/
import { SidenavItem } from '../model/sidenav-item.model';

/**Services.*/
import { AuthenticationService } from '../../authentication/authentication.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Usuario } from '../../usuario/usuario.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  @Input() public sidenavItems: SidenavItem[] = [];

  public opened = true; //inicializar aberto
  public mode="side"//over para celualr

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private deviceService: DeviceDetectorService,
  ) {
    if (this.deviceService.isMobile()) {
      this.opened = false; 
      this.mode="over"
    } else {
      this.opened = true; 
      this.mode="side"
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

  public goTo(sidenavItem: SidenavItem, sidenav?: MatDrawer): void {
    this.router.navigate([sidenavItem.route]);
    //sidenav.close();
  }

  public abrirHome(){
    const usuarioSession: Usuario = sessionStorage.getItem('usuario')
    ? JSON.parse(sessionStorage.getItem('usuario'))
    : null;

    
    if(usuarioSession){
      if(usuarioSession.rules){
        if(usuarioSession.rules.home){
          this.router.navigate(['/'+usuarioSession.rules.home]);
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/dashboard']);
    }

  }

  public logout(sidenav: MatDrawer): void {
    this.authenticationService.logout();
    sidenav.close();
  }
}
