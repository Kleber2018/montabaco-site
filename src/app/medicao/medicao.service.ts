import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

import { first } from 'rxjs/operators';

import { AngularFireAction, AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/compat/database';
import { createTrue } from 'typescript';



@Injectable({
  providedIn: 'root'
})
export class MedicaoService {
  listMedidores
 
  constructor(private db: AngularFireDatabase,) {
    this.listMedidores = db.list('medidores');
  }
  getTimeZone() {
    return new Date().toString();
  }

 //snapshotChanges retorna metadados
  getMedidores() {
    return this.listMedidores.snapshotChanges(); // mantem atualizado em realtime
  }

  //valueChanges retorna somente valores
  getMedicao(id: string){
    return this.db.object('medidores/'+id+'/medicao').valueChanges();
  }

  getMedicoes(id: string){
    return this.db.list('medidores/'+id+'/medicoes', ref =>   ref.limitToLast(30) ).valueChanges()
  }
}
