import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

/**Angular Material.*/
import { MatInput } from '@angular/material/input';

/**Models.*/


/**Services.*/
import { UsuarioService } from '../usuario.service';
import { AuthenticationService } from '../authentication.service';
// import { OneSignalService } from 'ngx-onesignal';

import { Usuario } from 'src/app/usuario/usuario.model';
import { EsqueciSenhaDialogComponent } from './esqueci-senha-dialog/esqueci-senha-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();
  public carregando: boolean =  false

  public formLogin: FormGroup;
  // public OneSignal;

  constructor(
    private authenticationService: AuthenticationService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    public dialog: MatDialog
    // public readonly onesignal: OneSignalService
  ) {
    const usuarioSession: Usuario = sessionStorage.getItem('usuario')
    ? JSON.parse(sessionStorage.getItem('usuario'))
    : null;

    // if (usuarioSession) {
    //   this.router.navigate(['/solicitacao']);
    // } else {
    //   const usuarioLocal: Usuario = localStorage.getItem('usuario')
    //   ? JSON.parse(localStorage.getItem('usuario'))
    //   : null;

    //   if (usuarioLocal) {
    //     sessionStorage.setItem('usuario', localStorage.getItem('usuario'));
    //     this.router.navigate(['/solicitacao']);
    //   } 
    // }
    this.carregando = false

    if (usuarioSession) {
      this.router.navigate(['/dashboard']);
    }
   }

  ngOnInit(): void {
    this.buildFormLogin();
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

  private buildFormLogin(): void {
    this.formLogin = this.formBuilder.group({
      eMail: ['', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required ]]
    });
  }

  private getUsuarioByEMail(eMail: string): void {
    this.usuarioService
      .getUsuarioByEMail(eMail.toLowerCase())
      .pipe(takeUntil(this.end))
      .subscribe(
        (response: Usuario[]) => {
          this.carregando = false
          localStorage.setItem('usuario', JSON.stringify(response[0]));
          sessionStorage.setItem('usuario', JSON.stringify(response[0]));
          if(response[0].rules){
            if(response[0].rules.home){
              this.router.navigate(['/'+response[0].rules.home]);
            } else {
              this.router.navigate(['/solicitacao']);
            }
          } else {
            this.router.navigate(['/solicitacao']);
          }
        },
        (error: string) => {
          this.carregando = false
          console.error('tt1', error);
          this.logout();
        }
      )
    ;
  }

  private login(eMail: string, password: string): void {
    this.authenticationService
      .login(eMail.toLowerCase(), password)
      .then(
        response => {
          this.getUsuarioByEMail(eMail.toLowerCase());
        }
      ).catch(error => {
          // this.formLogin.get('eMail').setValue('');
          this.formLogin.get('password').setValue('');
          this.carregando = false
        }
      )
    ;
  }

  // async onSubscribeNotification(gestorId: string) {
  //   //push notification
  //   // console.log('ante do OneSignal')
  //   this.OneSignal = window['OneSignal'];

  //   await this.OneSignal.getUserId().then((userIdNotification) => {
  //   // var id = userIdNotification;
  //   // console.log('dentro do onsignal', userIdNotification)
  //   // this.gestorService.updtGestorPush(gestorId, userIdNotification, 1)
  //   // this.empresaService.updtEmpresaPush(gestorId, userIdNotification, 1)

  //   // console.log('retorno onsignal');
  //   }).catch( (err) => {
  //     console.log('erro no se inscrever',err)
  //   });
  //   this.onesignal.subscribe();
  // }

  public submitFormLogin(): void {

    if (this.formLogin.valid) {
      this.carregando = true
      this.login(
        this.formLogin.get('eMail').value,
        this.formLogin.get('password').value
      );
    }
  }

  async esqueciMinhaSenha(){
    const dialogRefRedefinicao = this.dialog.open(EsqueciSenhaDialogComponent, {
      minWidth: 301,
      // minWidth: 400,
      data: this.formLogin.value.eMail
    });
    var retornoRedefinicao =  await dialogRefRedefinicao.afterClosed().toPromise()
    if(retornoRedefinicao == 'enviado'){
      const dialogRefAlert = this.dialog.open(AlertDialogComponent, {
        data: {descricao:"Verifique sua caixa de e-mail o link de redefinição da senha"}
      });
      dialogRefAlert.afterClosed().toPromise()
    } else {
      const dialogRefAlert = this.dialog.open(AlertDialogComponent, {
        data: {descricao:"E-mail não encontrado"}
      });
      dialogRefAlert.afterClosed().toPromise()
    }
  }

  public togglePasswordVisibility(input_password: MatInput): void {
    input_password.type = input_password.type === 'text' ? 'password' : 'text';
  }

  public comeBack(): void {
    this.location.back();
  }

  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']);
    }
}
