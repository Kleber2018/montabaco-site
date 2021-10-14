import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SidenavItem } from 'src/app/shared/model/sidenav-item.model';
import { Usuario } from 'src/app/usuario/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SidenavItemFactory } from 'src/app/shared/factory/sidenav-item.factory';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {


  private end: Subject<boolean> = new Subject();

  public sidenavItems: SidenavItem[] = [];

  public usuario: Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {

    this.usuario = sessionStorage.getItem('usuario')
    ? JSON.parse(sessionStorage.getItem('usuario'))
    : null;

    if (this.usuario) {
      this.sidenavItems = SidenavItemFactory.buildSidenav();
    } else {
      this.authenticationService.logout();
    }
  }

}
