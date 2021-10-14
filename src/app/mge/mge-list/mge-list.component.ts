import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {Router} from '@angular/router';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Usuario} from '../../usuario/usuario.model';
import {Mge} from '../mge.model';
import {MgeService} from '../mge.service';

import {SidenavItem} from '../../shared/model/sidenav-item.model';
import {SidenavItemFactory} from '../../shared/factory/sidenav-item.factory';
import {FormControl, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {AlertDialogComponent} from 'src/app/shared/alert-dialog/alert-dialog.component';
import {DeviceDetectorService} from 'ngx-device-detector';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {CropperDialogComponent} from '../../shared/cropper-dialog/cropper-dialog.component';

import {ImgDialogComponent} from 'src/app/shared/img-dialog/img-dialog.component';
import {Solicitacao} from '../../solicitacao/solicitacao.model';
import {OpcoesDialogComponent} from '../../solicitacao/dialog/opcoes-dialog/opcoes-dialog.component';
import {MedicoesDialogComponent} from '../dialog/medicoes-dialog/medicoes-dialog.component';

import {NgxImageCompressService} from 'ngx-image-compress';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as XLSX from 'xlsx';
import { MgeDialogComponent } from '../dialog/mge-dialog/mge-dialog.component';


@Component({
  selector: 'app-mge-list',
  templateUrl: './mge-list.component.html',
  styleUrls: ['./mge-list.component.css']  
})
export class MgeListComponent implements OnInit, OnDestroy {

  imgResultBeforeCompress:string;
  imgResultAfterCompress:string;
  private end: Subject<boolean> = new Subject();
  // public mesPassado = new Date().setMonth((new Date().getMonth()-1))
  public filtroDateInit = new FormControl(new Date(new Date().setMonth((new Date().getMonth() - 1))).toISOString());
  public filtroDateFim = new FormControl((new Date()).toISOString());
  public carregandoUpload: boolean;
  public statusEscolhido: string = 'Pendentes';
  public sidenavItems: SidenavItem[] = [];
  public mges: Mge[];

  public listStatus = [
    {
      cod: '1-pendente',
      titulo: 'Pendente'
    },
    {
      cod: '2-aceito',
      titulo: 'Aceito'
    },
    {
      cod: '3-cancelado',
      titulo: 'Cancelado'
    }
  ];

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


  public equipe  = '';
  public usuario: Usuario;
  public statusOSE: string = '';
  public formPeriodo = new FormControl('');
  public formEquipe = new FormControl('');
  //public equipes = ['SDMEA', 'SDMEB', 'SDMEC', 'SDMED', 'SDMEE', 'SDMEF', 'SDMEG', 'SDMEH', 'SDMEI', 'SDMEJ'];
  public equipes: any;
  constructor(private router: Router,
              private deviceService: DeviceDetectorService,
              private mgeService: MgeService,
              private authenticationService: AuthenticationService,
              public dialog: MatDialog,
              private imageCompress: NgxImageCompressService) { 

                if((new Date().getMonth()+1) < 10){
                  this.formPeriodo = new FormControl('0'+(new Date().getMonth()+1)+'/'+ (new Date().getFullYear()-2000));
                } else {
                  this.formPeriodo = new FormControl((new Date().getMonth()+1)+'/'+ (new Date().getFullYear()-2000));
                }
                this.usuario  = sessionStorage.getItem('usuario')
                ? JSON.parse(sessionStorage.getItem('usuario'))
                : 'nenhum';
            
                if (this.usuario) {
                  if (this.usuario.equipe) {
                      if(this.usuario.equipe == 'ALL'){
                          this.equipes = ['SDMEA', 'SDMEB', 'SDMEC', 'SDMED', 'SDMEE', 'SDMEF', 'SDMEG', 'SDMEH', 'SDMEI', 'SDMEJ'];
                          const eq = sessionStorage.getItem('equipe')
                            ? JSON.parse(sessionStorage.getItem('equipe'))
                            : null;
                          if(eq){
                            this.equipe = eq
                          } else {
                            this.equipe = this.usuario.equipe
                          }
                      }  else {
                        this.equipe = this.usuario.equipe
                      }
                  }

                  this.formEquipe = new FormControl(this.equipe);
                  this.sidenavItems = SidenavItemFactory.buildSidenav();
                  this.iniciandoListaMgesPendentes();
            
                } else {
                  this.authenticationService.logout();
                }
              }

 

  ngOnInit() {
  }


   iniciandoListaMgesPendentes() {
     this.statusEscolhido = 'Pendentes'
     this.statusOSE = 'Pendente'


  /*  if (this.usuario.equipe) {
      if(this.usuario.equipe == 'ALL'){

      } else {
        this.equipe =  this.usuario.equipe;
      }
    } else {
      this.equipe = 'nenhum'
    }
   */
     this.carregandoUpload = false;

     this.mgeService.getPreventivasPendentesWhere(this.equipe, this.formPeriodo.value).pipe(takeUntil(this.end)).subscribe(res => {
      this.mges = res.map(e => {
        return {
          uid: e.payload.doc.id,
          MGE: e.payload.doc.data().MGE,
          OSE: e.payload.doc.data().OSE,
          status: e.payload.doc.data().status,
          createdAt: e.payload.doc.data().createdAt,
          usuario: e.payload.doc.data().usuario,
          updatedAt: e.payload.doc.data().updatedAt,
          img: e.payload.doc.data().img
        };
      });
      if(this.mges){
        this.mges.sort((a, b) => {
          return +b.uid - +a.uid;
        });
      }
      
      console.log(this.mges);
    });
  }


  iniciandoListaMgesExecutadas() {
    this.statusEscolhido = 'Executadas'
    this.statusOSE = 'Executada'
    /*
    if (this.usuario.equipe) {
        this.equipe =  this.usuario.equipe;
    } else {
      this.equipe = 'nenhum'
    }*/
     this.carregandoUpload = false;

     this.mgeService.getPreventivasExecutadasWhere(this.equipe, this.formPeriodo.value).pipe(takeUntil(this.end)).subscribe(res => {
      this.mges = res.map(e => {
        return {
          uid: e.payload.doc.id,
          MGE: e.payload.doc.data().MGE,
          OSE: e.payload.doc.data().OSE,
          status: e.payload.doc.data().status,
          createdAt: e.payload.doc.data().createdAt,
          usuario: e.payload.doc.data().usuario,
          updatedAt: e.payload.doc.data().updatedAt,
          img: e.payload.doc.data().img,
          hora: e.payload.doc.data().hora,
        };
      });
      if(this.mges){
        this.mges.sort((a, b) => {
          return +b.updatedAt.seconds - +a.updatedAt.seconds;
        });
      }
      console.log('sort1', this.mges);
    });
  }

   // para alterar a imagem
  async uploadImg(event, mgeLocal: Mge, ) {

    if (this.usuario.rules.administrador || mgeLocal.OSE.equipe === this.usuario.equipe) {
      if (event.target.files[0].type === 'image/jpg' || event.target.files[0].type === 'image/png' ||  event.target.files[0].type === 'image/jpeg') {
        this.carregandoUpload = true;
        const dialogRefFile = this.dialog.open(CropperDialogComponent, {
          minWidth: 301,
          // minWidth: 400,
          data: {
            imagem: event
          }
        });
        const retornoImg =  await dialogRefFile.afterClosed().toPromise();
        if (retornoImg) {
          const indexSolic = this.mges.indexOf(mgeLocal);
          if (this.mges[indexSolic].img) {
            if (this.mges[indexSolic].img.length < 11) {

              const retornando = await this.mgeService.uploadFile(retornoImg, this.mges[indexSolic].uid, this.mges[indexSolic].img, mgeLocal.OSE.localidade+'/'+mgeLocal.OSE.unidade);
              console.log('depois de salvo o arquivo', retornando);

            } else {
              this.alertaDialog({descricao: 'Máximo 10 imagens'});
            }
          } else {
            const retornando = await this.mgeService.uploadFile(retornoImg, this.mges[indexSolic].uid, [], mgeLocal.OSE.localidade+'/'+mgeLocal.OSE.unidade);
            console.log('depois de salvo o arquivo', retornando);
          }
        }
      } else {
        this.alertaDialog({descricao: 'Imagem ' + event.target.files[0].type.toUpperCase() + ' não suportada ou desconhecida'});
      }
    } else {
      this.alertaDialog({descricao: 'Sua equipe não é responsável por essa Preventiva'});
    }
    this.carregandoUpload = false;
  }

  salvarLocalStorageEquipe(equipe: string){
    this.equipe = equipe
    sessionStorage.setItem('equipe', JSON.stringify(equipe))
    this.iniciandoListaMgesExecutadas()
  }

  async uploadImgCompress(mgeLocal: Mge,){
    if (this.usuario.rules.administrador || mgeLocal.OSE.equipe === this.usuario.equipe) {
       this.carregandoUpload = true;

        const indexSolic = this.mges.indexOf(mgeLocal);
        if (this.mges[indexSolic].img) {
          if (this.mges[indexSolic].img.length < 11) {
            this.imageCompress.uploadFile().then(({image, orientation}) => {
              this.imgResultBeforeCompress = image;
              console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
              
              this.imageCompress.compressFile(image, orientation, 75, 50).then(
                async result => {
                  //console.log(result);
                  this.imgResultAfterCompress = result;
                  console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));

                  if(this.imageCompress.byteCount(result) > 10000){
                    const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);            
                    const retornando = await this.mgeService.uploadFile(imageBlob, this.mges[indexSolic].uid, this.mges[indexSolic].img, mgeLocal.OSE.localidade+'/'+mgeLocal.OSE.unidade);
                    console.log('depois de salvo o arquivo', retornando);
                  } else {
                    this.alertaDialog({descricao: 'Erro de conexão. Tente Novamente!'});
                  }
                }
              );
            });       
          } else {
            this.alertaDialog({descricao: 'Máximo 10 imagens'});
          }
        } else {
          this.imageCompress.uploadFile().then(({image, orientation}) => {
            this.imgResultBeforeCompress = image;
            console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
            this.imageCompress.compressFile(image, orientation, 75, 50).then(
              async result => {
                //console.log(result);
                this.imgResultAfterCompress = result;
                console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
                if(this.imageCompress.byteCount(result) > 10000){
                  const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);            
                  const retornando = await this.mgeService.uploadFile(imageBlob, this.mges[indexSolic].uid, [], mgeLocal.OSE.localidade+'/'+mgeLocal.OSE.unidade);
                  console.log('depois de salvo o arquivo', retornando);
                } else {
                  this.alertaDialog({descricao: 'Erro de conexão. Tente Novamente!'});
                }
              }
            );
          });
        }    
    } else {
      this.alertaDialog({descricao: 'Sua equipe não é responsável por essa Preventiva'});
    }
    this.carregandoUpload = false;
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  async abrirImg(mgeLocal: Mge, refer: string) {
    let dialogImg: any;
    if (this.deviceService.isMobile()) {
      dialogImg = this.dialog.open(ImgDialogComponent, {
        minWidth: '100%',
        // height: '100%',
        data: {
          url: refer
        }
      });
    } else {
      dialogImg = this.dialog.open(ImgDialogComponent, {
        //minWidth: 450,
        maxWidth: 700,
        data: {
          url: refer
        }
      });
    }
    let retornoImg = await dialogImg.afterClosed().toPromise();
    if (retornoImg) {
      if (await retornoImg === 'excluir') {
        this.removerReferenciaImg(mgeLocal, refer);
      }
    }
  }


  async removerReferenciaImg(mgeLocal: Mge, refer: string) {
    if (this.usuario.rules.administrador || mgeLocal.OSE.equipe == this.usuario.equipe) {
      const retornoDialog =  await this.alertaDialog({descricao: 'Você tem certeza que deseja excluir a imagem?', opcao1: 'Excluir'});
      if (retornoDialog) {
        if (retornoDialog.retorno === 'opcao1') {
          let indexSolic = this.mges.indexOf(mgeLocal);
          let indexSolicImg = this.mges[indexSolic].img.indexOf(refer);
          this.mges[indexSolic].img.splice(indexSolicImg, 1);
          this.mgeService.updateDeleteUrl(this.mges[indexSolic].uid, this.mges[indexSolic].img);
        }
      }
    } else {
      await this.alertaDialog({descricao: 'Somente o responsáveis pela equipe podem remover a imagem!'});
    }
  }

  async alertaDialog(data: any) {
    // data: {
    //   descricao: descricao,
    //   opcao1: 'Excluir',
    // }
    const dialogRefAlert = this.dialog.open(AlertDialogComponent, {
      data
    });
    return await dialogRefAlert.afterClosed().toPromise();
  }

  medicoesDialog(mge: Mge) {
    console.log(this.usuario)
    console.log(mge.OSE.equipe)
    var permiteEditar = false
    if(this.usuario.equipe == mge.OSE.equipe && this.usuario.email !== 't@t.com'){
      permiteEditar = true
    }

    if(this.deviceService.isMobile()) {
      const dialogRefMedicoes = this.dialog.open(MedicoesDialogComponent, {
        minWidth: '100%',
        height: '100%',
        data:  {mge: mge, permiteEditar: permiteEditar}
      });
      dialogRefMedicoes.afterClosed()
    } else {
      const dialogRefMedicoes = this.dialog.open(MedicoesDialogComponent, {
        // maxWidth: 400,
        minWidth: 400,
        minHeight: 400,
        data: {mge: mge, permiteEditar: permiteEditar}
      });
      dialogRefMedicoes.afterClosed()
    }
  }

  detalhesDialog(mge: Mge) {
    if(this.deviceService.isMobile()) {
      const dialogRefMedicoes = this.dialog.open(MgeDialogComponent, {
        minWidth: '100%',
        height: '100%',
        data:  mge
      });
      dialogRefMedicoes.afterClosed()
    } else {
      const dialogRefMedicoes = this.dialog.open(MgeDialogComponent, {
        // maxWidth: 400,
        minWidth: 400,
        minHeight: 400,
        data:  mge
      });
      dialogRefMedicoes.afterClosed()
    }
  }

  /*name of the excel-file which will be downloaded. */
  fileName= 'ExcelSheet.xlsx';
  // type AOA = any[][];
  async downloadExcel(){
    let data = [ ['OSE', 'UNIDADE', 'LOCALIDADE', 'EQUIPE', 'DESCRICAO', 'PRESSÃO', 'TENSÃO', 'DATA PREVISTA', 'DATA EXECUÇÃO', 'IDENTIFICACAO 1', 'HORIMETRO 1', 'CORRENTE 1', 'TEMPERATURA 1', 'IDENTIFICACAO 2', 'HORIMETRO 2', 'CORRENTE 2', 'TEMPERATURA 2', 'IDENTIFICACAO 3', 'HORIMETRO 3', 'CORRENTE 3', 'TEMPERATURA 3', 'IDENTIFICACAO 4', 'HORIMETRO 4', 'CORRENTE 4', 'TEMPERATURA 4', 'IDENTIFICACAO 5', 'HORIMETRO 5', 'CORRENTE 5', 'TEMPERATURA 5']];
    await this.mges.forEach(async value => {
      let valor = [
        value.uid,
        value.OSE.unidade,
        value.OSE.localidade,
        value.OSE.equipe,
        value.OSE.descricao,
        value.MGE.pressao,
        value.MGE.tensao,
        ((value.OSE.prazo.seconds/86400)+25569), //data tipo excel
        ((value.OSE.data_execucao.seconds/86400)+25569),
        value.uid
      ]
      await value.MGE.equipamentos.forEach(v => {
        valor.push(
          v.identificacao,
          v.horimetro,
          v.corrente,
          v.temperatura
        )
      })
      await data.push(valor);
    })
    //(value.createdAt/(1000*60*60*24)+25569)
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Medições');
    /* save to file */
    XLSX.writeFile(wb, 'MEDIÇÕES.xlsx');
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

}

