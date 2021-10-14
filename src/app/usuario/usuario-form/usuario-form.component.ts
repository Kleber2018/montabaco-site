import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { SidenavItemFactory } from 'src/app/shared/factory/sidenav-item.factory';
import { SidenavItem } from 'src/app/shared/model/sidenav-item.model';
import { Usuario } from '../usuario.model';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  private end: Subject<boolean> = new Subject();

  public sidenavItems: SidenavItem[] = [];
  public usuario: Usuario;

  public user: Usuario;
  public formUser: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private authenticationService: AuthenticationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    const usuario: Usuario = sessionStorage.getItem('usuario')
    ? JSON.parse(sessionStorage.getItem('usuario'))
    : null;

     if (usuario) {
      if (this.activatedRoute.snapshot.params.id) { // caso venha um id é UPDATE
        this.usuarioService.getUsuario(this.activatedRoute.snapshot.params.iud).pipe(takeUntil(this.end)).subscribe(res => {
            this.user = res;
            this.buildFormDemand(this.user);
        });
      } else { // INSERT
          this.user = {
            nome: '',
            email: '',
            rules: {},
            equipe: '',
            privilegio: ''
          };
        this.buildFormDemand(this.user);
      }
      this.sidenavItems = SidenavItemFactory.buildSidenav();
    } else {
      this.authenticationService.logout();
    }
  }


  private buildFormDemand(carregaUser: Usuario): void {
    console.log('build', carregaUser);
    this.formUser = this.formBuilder.group({
        nome: [carregaUser.nome, [Validators.required, Validators.minLength(3)]],
        email: [carregaUser.email, [Validators.required, Validators.email]],
        equipe: [carregaUser.equipe, [Validators.required, Validators.minLength(3)]],
   });
  }


  public submitFormDemand() {
    if (this.formUser.valid) {
      this.user = this.formUser.value
      if (this.activatedRoute.snapshot.params.id) {
        this.usuarioService.updateUsuario(this.user).then(r => console.log('retorno linha 78 usuario:', r));
        const dialogRefAlertExist = this.dialog.open(AlertDialogComponent, {
          data: {
            descricao: 'Usuario Alterado',
            // opcao1: 'Ok'
            // opcao2: 'Confirmar novo Pedido',
          }
        });
        dialogRefAlertExist.afterClosed().subscribe(result => {
          this.router.navigate(['/']);
        });
      } else {
        this.usuarioService.addUsuario(this.user).then(r => console.log('retorno linha 90 usuario:', r));
        const dialogRefAlertExist = this.dialog.open(AlertDialogComponent, {
          data: {
            descricao: 'Usuário Salvo',
            // opcao1: 'Ok'
            // opcao2: 'Confirmar novo Pedido',
          }
        });
        dialogRefAlertExist.afterClosed().subscribe(result => {
          this.router.navigate(['/usuario']);
        });
      }
    } else {
        console.log('invalido');
    }
  }

}
