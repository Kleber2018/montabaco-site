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
  listMedidoresViews
 
  constructor(private db: AngularFireDatabase,) {
    this.listMedidores = db.list('medidores');
    this.listMedidoresViews = db.list('views');
  }
  getTimeZone() {
    return new Date().toString();
  }

 //snapshotChanges retorna metadados
  getMedidores() {
    return this.listMedidoresViews.snapshotChanges(); // mantem atualizado em realtime
  }

  //valueChanges retorna somente valores
  getMedicao(id: string){
    return this.db.object('medidores/'+id+'/medicao').valueChanges();
  }

  getMedicoes(id: string){
    return this.db.list('medidores/'+id+'/medicoes', ref =>   ref.orderByChild('filtro').equalTo(0).limitToLast(40) ).valueChanges()
  }
}
