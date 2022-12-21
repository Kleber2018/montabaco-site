import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

import { first } from 'rxjs/operators';

import { Timestamp, serverTimestamp, Firestore, doc, onSnapshot, DocumentReference, collection, docSnapshots, docData, getDoc, getDocs, query, where, getDocsFromCache, CollectionReference, addDoc, updateDoc, increment, orderBy, limit } from '@angular/fire/firestore';
import { createTrue } from 'typescript';



@Injectable({
  providedIn: 'root'
})
export class MedicaoService {
  private estufasCollection: CollectionReference;
  private medicoesCollection: CollectionReference;

  constructor(protected db: Firestore) {
    this.estufasCollection = collection(this.db, "estufas");
    this.medicoesCollection = collection(this.db, "monitoramento");
  }
  getTimeZone() {
    return new Date().toString();
  }

 //snapshotChanges retorna metadados
  async getMedidores() {
    return await getDocs(query(this.estufasCollection, 
      // where("id", "==", id),
      //  where("filtro", "==", 0),
      //where("createdAt", ">", timestampInic),
      // where("createdAt", "<", timestampFim),
      // orderBy("createdAt"),  
      // limit(1)
      )
    );
    //return this.listMedidoresViews.snapshotChanges(); // mantem atualizado em realtime
  }

  //valueChanges retorna somente valores
  async getMedicao(id: string){

   // return this.db.object('monitoramento/'+id+'/medicao').valueChanges();

    return await getDocs(query(this.medicoesCollection, 
      where("id", "==", id),
    //  where("filtro", "==", 0),
     //where("createdAt", ">", timestampInic),
     // where("createdAt", "<", timestampFim),
     orderBy("createdAt", "desc"), 
      limit(1)
      )
    );
    //return this.db.object('medidores/'+id+'/medicao').valueChanges();
  }

  async getMedicoes(id: string){
    //return this.db.list('medidores/'+id+'/medicoes', ref =>   ref.orderByChild('filtro').equalTo(0).limitToLast(40) ).valueChanges()

    // console.log('monitoramento:37')
    // var dataLocalInic = new Date(dataInic);
    // var diaI = dataLocalInic.getDate();
    // var mesI = dataLocalInic.getMonth();
    // var anoI = dataLocalInic.getFullYear();
 
    // var dataLocalFim = new Date(dataFim);
    // var diaF = dataLocalFim.getDate();
    // var mesF = dataLocalFim.getMonth();
    // var anoF = dataLocalFim.getFullYear();
    // console.log('monitoramento:47', diaF)
    // var timestampInic= Timestamp.fromDate(new Date(anoI,mesI,diaI))
    // var timestampFim= Timestamp.fromDate(new Date(anoF,mesF,diaF))
 
    // console.log('monitoramento:51', timestampInic)
 
    return await getDocs(query(this.medicoesCollection, 
         where("id", "==", id),
         where("filtro", "==", 0),
        //where("createdAt", ">", timestampInic),
        // where("createdAt", "<", timestampFim),
         orderBy("createdAt", "desc") ,  
         limit(80)
       )
     );
  }
}
