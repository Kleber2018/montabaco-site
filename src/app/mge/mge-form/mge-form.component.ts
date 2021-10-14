import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Usuario } from '../../usuario/usuario.model';
import { Mge } from '../mge.model';
import { MgeService } from '../mge.service';

import { SidenavItem } from '../../shared/model/sidenav-item.model';
import { SidenavItemFactory } from '../../shared/factory/sidenav-item.factory';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { first, takeUntil } from 'rxjs/operators';

import * as XLSX from 'xlsx';
import { EquipamentoService } from 'src/app/equipamento/equipamento.service';

@Component({
  selector: 'app-mge-form',
  templateUrl: './mge-form.component.html',
  styleUrls: ['./mge-form.component.css']
})
export class MgeFormComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  public sidenavItems: SidenavItem[] = [];

  willDownload = false;
  public planilha: any;
  public usuario: Usuario;

  public mge: Mge;
  public mgeVazia: Mge = {
    usuario: '',
    OSE: {
      gerencia: '', // GRTB
      localidade: '', // Carambeí
      unidade: '', // eet-01
      processo: '', // SD, FAD
      pese: '', // MELHORIA, ESTUDO, ...
      ose: '', // NORMAL, URGENTE
      equipe: '',
      responsavel: '',
      descricao: '',
      data: '',
      prazo: '',
    },
    MGE: { },
    status: '1-pendente', // 1-pendente, 2-aceito, 3-cancelado
    img: [''],
    updatedAt: '',
    createdAt: '',
  };
  public formMge: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private mgeService: MgeService,
              private authenticationService: AuthenticationService,
              public dialog: MatDialog,
              public equipamentoService: EquipamentoService,
              private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
     const usuario: Usuario = sessionStorage.getItem('usuario')
    ? JSON.parse(sessionStorage.getItem('usuario'))
    : null;

     if (usuario) {
        const mgeLocal = JSON.parse(localStorage.getItem('mge'));
        if (mgeLocal) {
          this.mge = mgeLocal;
        } else {
          this.mge = this.mgeVazia;
        }
        this.mge.usuario = usuario;
        this.sidenavItems = SidenavItemFactory.buildSidenav();
        this.buildFormMge();
    } else {
      this.authenticationService.logout();
    }
   }


   private buildFormMge(): void {
     var periodo
    if((new Date().getMonth()+1) < 10){
      periodo = '0'+(new Date().getMonth()+2)+'/'+ (new Date().getFullYear()-2000);
    } else {
      periodo = (new Date().getMonth()+2)+'/'+ (new Date().getFullYear()-2000);
    }
    this.formMge = this.formBuilder.group({
        periodo: [periodo, [Validators.required]],
   });
  }

   onFileChangePSM(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log(jsonData);
      if(jsonData.Plan1){
        console.log(jsonData.Plan1[0].ose);
        var retorno = await this.mgeService.getMge(jsonData.Plan1[0].ose).pipe(first()).toPromise().then(res => {
          return res
        })
        console.log('primeira linha existe?', retorno)
        console.log(jsonData.Plan1);
        if(retorno){
          alert('RECUSADO - Já existe registro com esse número de OSE')
        } else {
          this.mgeService.addMges(jsonData.Plan1, this.usuario, this.formMge.value.periodo);
          alert('Inserido preventivas com sucesso')
          //this.planilha = jsonData.RO01;
          //const dataString = JSON.stringify(jsonData);
          // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
        }
      } else {
        alert('Nome da planilha precisa ser Plan1')
      }

    };
    reader.readAsBinaryString(file);
  }


   // para alterar a imagem
 /*  async onFileChangeEquipamento(event) {
    console.log(event)
    fetch(event.target.files[0])
    .then(res => res.blob())
    .then(blob => {
        var dataLocal = new Date();
        var nomeImagem = dataLocal.getTime().toString();
        const FileArquivo = new File([blob], nomeImagem, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        this.equipamentoService.uploadFileExcel(FileArquivo);
     })

  }

*/
  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
