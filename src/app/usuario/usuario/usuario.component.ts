import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SidenavItemFactory } from 'src/app/shared/factory/sidenav-item.factory';
import { SidenavItem } from 'src/app/shared/model/sidenav-item.model';
import { Usuario } from 'src/app/usuario/usuario.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();
  public sidenavItems: SidenavItem[] = [];

  public usuarios: Usuario [];

  constructor() { 
    this.sidenavItems = SidenavItemFactory.buildSidenav();
  }

  ngOnInit(): void {
  }



  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

}
