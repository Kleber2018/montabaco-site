import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import { Usuario } from 'src/app/usuario/usuario.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import {Mge} from '../../mge.model';
import {MgeService} from '../../mge.service';


@Component({
  selector: 'app-medicoes-dialog',
  templateUrl: './medicoes-dialog.component.html',
  styleUrls: ['./medicoes-dialog.component.css']
})
export class MedicoesDialogComponent {
  public mge: Mge;
  public usuario: Usuario;
  public formMge: FormGroup;

  public fxCalculo = '100%'
  public data_execucao = new FormControl((new Date()).toISOString());
  public hora_inic = new FormControl();
  public hora_fim = new FormControl();
  public permiteEditar = false;



  constructor(@Inject(MAT_DIALOG_DATA) public data: {mge: Mge, permiteEditar: boolean},
              public dialogRef: MatDialogRef<MedicoesDialogComponent>,
              private router: Router,
              private formBuilder: FormBuilder,
              private mgeService: MgeService,
              public dialog: MatDialog) {
                this.usuario  = sessionStorage.getItem('usuario')
                ? JSON.parse(sessionStorage.getItem('usuario'))
                : null;

                console.log('data', data)

                this.permiteEditar = data.permiteEditar;
                this.mge = data.mge;
                if(this.mge.OSE.qtd_equipamentos == 0){
                  this.mge.OSE.qtd_equipamentos = 1
                }
                if(this.mge.OSE.qtd_equipamentos !== 0){
                  this.fxCalculo = 100/this.mge.OSE.qtd_equipamentos+'%'
                }

                this.buildFormMge(this.mge);
              }

  get equipamentos(): FormArray {
    return this.formMge.get("equipamentos") as FormArray;
  }

  public adicionarCMB(){
    if(this.mge.OSE.qtd_equipamentos < 5){
      this.mge.OSE.qtd_equipamentos = this.mge.OSE.qtd_equipamentos+1
      this.equipamentos.push(this.createFormGroupEquipamento(this.mge.OSE.qtd_equipamentos));
      console.log(this.mge.OSE);
      this.fxCalculo = 100/this.mge.OSE.qtd_equipamentos+'%'
    }
  }

  public removerCMB(){
    if(this.mge.OSE.qtd_equipamentos > 1){
      this.equipamentos.removeAt(this.mge.OSE.qtd_equipamentos-1)
      this.mge.OSE.qtd_equipamentos = this.mge.OSE.qtd_equipamentos-1
      console.log(this.mge.OSE);
      this.fxCalculo = 100/this.mge.OSE.qtd_equipamentos+'%'
    }
  }


  private buildFormMge(mge: Mge): void {
    console.log(mge)
    if(mge.hora){
      if(mge.hora.fim){
        this.hora_fim.setValue(mge.hora.fim)
        this.hora_inic.setValue(mge.hora.inic)
      }
    }

    if (mge.MGE.equipamentos) {

      this.formMge = this.formBuilder.group({
        equipamentos: this.formBuilder.array([this.createFormGroupEquipamento(1, mge.MGE.equipamentos[0])]), 
       // vazao: [mge.MGE.vazao, [Validators.maxLength(5)]],
       // pressao: [mge.MGE.pressao, [Validators.maxLength(5)]],
        tensao: [mge.MGE.tensao, [Validators.maxLength(5)]],
        obs: [mge.MGE.obs, [Validators.maxLength(250)]]
       });
       this.data_execucao = new FormControl((new Date(mge.OSE.data_execucao.seconds*1000)).toISOString());

       for (let index = 0; index < (this.mge.OSE.qtd_equipamentos-1); index++) {
        this.equipamentos.push(this.createFormGroupEquipamento(index+2, mge.MGE.equipamentos[index+1] ));
      }
    } else {
      this.formMge = this.formBuilder.group({
        equipamentos: this.formBuilder.array([this.createFormGroupEquipamento(1)]), 
       // vazao: [null, [Validators.maxLength(5)]],
       // pressao: [null, [Validators.maxLength(5)]],
        tensao: [null, [Validators.maxLength(5)]],
        obs: ['', [Validators.maxLength(250)]]
       });

       this.data_execucao = new FormControl((new Date()).toISOString());

       for (let index = 0; index < (this.mge.OSE.qtd_equipamentos-1); index++) {
         this.equipamentos.push(this.createFormGroupEquipamento(index+2));
       }
    }

  }

  createFormGroupEquipamento(ordem: number, equipamento?: any){


    if(equipamento){
      console.log('equipamento para construir:', equipamento)
      var temperatura = ''
      if(equipamento.temperatura){
        temperatura = equipamento.temperatura
      } else if(equipamento.t){
        temperatura = equipamento.t
      } 

      var corrente = ''
      if(equipamento.corrente){
        corrente = equipamento.corrente
      } else if(equipamento.a){
        corrente = equipamento.a
      } 

      var h = ''
      if(equipamento.h){
        h = equipamento.h
      } 

      var q = ''
      if(equipamento.q){
        q = equipamento.q
      } 


      return this.formBuilder.group({
        ordem: 'CMB-0'+ordem,
        identificacao: [equipamento.identificacao, [Validators.maxLength(12)]],
        a: [corrente, [Validators.maxLength(6)]],
        horimetro: [equipamento.horimetro, [Validators.maxLength(10)]],
        t: [temperatura, [Validators.maxLength(6)]],
        h: [h, [Validators.maxLength(8)]],
        q: [q, [Validators.maxLength(8)]],
      });   
    } else {
      return this.formBuilder.group({
        ordem: 'CMB-0'+ordem,
        identificacao: [null, [Validators.maxLength(12)]],
        a: [null, [Validators.maxLength(6)]],
        horimetro: [null, [Validators.maxLength(10)]],
        t: [null, [Validators.maxLength(6)]],
        h: [null, [Validators.maxLength(8)]],
        q: [null, [Validators.maxLength(8)]],
      });   
    }

  }

  submitFormMedicao() {
    this.mgeService.updtMedicoes(this.mge.uid, this.formMge.value, this.data_execucao.value, {nome: this.usuario.nome, email: this.usuario.email}, {inic:this.hora_inic.value, fim: this.hora_fim.value}, this.mge.OSE.qtd_equipamentos);
    this.dialogRef.close();
  }

  async alertaDialog(data: any){
    // data: {
    //   descricao: descricao,
    //   opcao1: 'Excluir',
    // }
    const dialogRefAlert = this.dialog.open(AlertDialogComponent, {
      data
    });
    return await dialogRefAlert.afterClosed().toPromise();
  }

  // escolhendo(servico: {cod: string, titulo: string}) {
  //    this.dialogRef.close(servico);
  // }

}
