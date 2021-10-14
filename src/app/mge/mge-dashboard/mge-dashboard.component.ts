import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/* Factories. */
import { SidenavItemFactory } from '../../shared/factory/sidenav-item.factory';

/* Models. */

import { SidenavItem } from '../../shared/model/sidenav-item.model';


/* Services.*/
import { AuthenticationService } from '../../authentication/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MgeService } from '../mge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/usuario/usuario.model';


@Component({
  selector: 'app-mge-dashboard',
  templateUrl: './mge-dashboard.component.html',
  styleUrls: ['./mge-dashboard.component.css']
})
export class MgeDashboardComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  public sidenavItems: SidenavItem[] = [];
  public usuario: Usuario;

  constructor(
    private authenticationService: AuthenticationService,
    private mgeService: MgeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) { }


S
  ngOnInit(): void {

    this.usuario = sessionStorage.getItem('usuario')
    ? JSON.parse(sessionStorage.getItem('usuario'))
    : null;

    if (this.usuario) {
      this.sidenavItems = SidenavItemFactory.buildSidenav();
    } else {
      this.authenticationService.logout();
    }
/*
    if (this.activatedRoute.snapshot.params.id) { // caso venha um id é UPDATE
      this.empresaID = this.activatedRoute.snapshot.params.id;
      this.empresaService.getEmpresa(this.empresaID).subscribe(res => {
        this.empresa = res;
        this.iniciando = false;
         // ppula o formulário com o retorno do bd
      });
      this.empresaService.getOpcionaisProdutoWhere(this.empresaID, 'adicional').subscribe(res => {
        this.adicionais = res.map(e => {
          return {
            id: e.payload.doc.id,
            url_imagem: e.payload.doc.data().url_imagem,
            titulo: e.payload.doc.data().titulo,
            descricao: e.payload.doc.data().descricao,
            categoria: e.payload.doc.data().categoria,
            status: e.payload.doc.data().status,
            tipo: e.payload.doc.data().tipo,
            conjunto: e.payload.doc.data().conjunto
          };
        });
      });
     */
  }



  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
