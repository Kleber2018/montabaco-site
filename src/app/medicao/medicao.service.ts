import { Injectable } from '@angular/core';
import { Observable, Subscribable } from 'rxjs';
import * as firebase from 'firebase/app';

import { first, map } from 'rxjs/operators';

import { Timestamp, serverTimestamp, Firestore, doc, onSnapshot, DocumentReference, collection, docSnapshots, docData, getDoc, getDocs, query, where, getDocsFromCache, CollectionReference, addDoc, updateDoc, increment, orderBy, limit } from '@angular/fire/firestore';
import { createTrue } from 'typescript';
import { snapshotChanges } from '@angular/fire/compat/database';
import { Subscribe } from '@firebase/util';



@Injectable({
  providedIn: 'root'
})
export class MedicaoService {
  private estufasCollection: CollectionReference;
  private medicoesCollection: CollectionReference;
  private logsCollection: CollectionReference;

  constructor(protected db: Firestore) {
    this.estufasCollection = collection(this.db, "estufas");
    this.medicoesCollection = collection(this.db, "monitoramento");
    this.logsCollection = collection(this.db, "log");
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

  async getMedicoesSnapshot(id: string){
    const q = query(this.medicoesCollection, 
      where("id", "==", '215821820'),
      //where("filtro", "==", 0),
     //where("createdAt", ">", timestampInic),
      //where("createdAt", "<", timestampFim),
      orderBy("createdAt", "desc") ,  
      limit(20)
    )


    //return docSnapshots(q).pipe(map(data=>data.data()))
   const _med =  onSnapshot(q, async (querySnapshot) => {

    
      const _medicoes = [];
      return map(querySnapshot => {

      })

      querySnapshot.forEach((doc) => {
        _medicoes.push(doc.data());

      });
      console.log("dentro")
      console.log(_medicoes)
      return _medicoes
      //console.log("Current cities in CA: ", cities.join(", "));
    });

    console.log("dentro2")
    console.log(_med)
    return _med;
    
  }

  //valueChanges retorna somente valores
  async getMedicao(id: string){
    var _id = id

    if(id == '2195114000'){
      _id = '21951140'
    } else if(id == '21582182001'){
      _id = '215821820'
    }else  if(id == '21582182000'){
      _id = '215821820'
    } 

   // return this.db.object('monitoramento/'+id+'/medicao').valueChanges();

    return await getDocs(query(this.medicoesCollection, 
      where("id", "==", _id),
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
    var timestampFim= Timestamp.fromDate(new Date(2023,0,29))
 
    // console.log('monitoramento:51', timestampInic)

    if(id == '2195114000'){
      console.log('21951140')
      return await getDocs(query(this.medicoesCollection, 
        where("id", "==", '21951140'),
        //where("filtro", "==", 0),
       //where("createdAt", ">", timestampInic),
        where("createdAt", "<", timestampFim),
        orderBy("createdAt", "desc") ,  
        limit(120)
      )
      );
    } else if(id == '21582182001'){
      return await getDocs(query(this.medicoesCollection, 
        where("id", "==", '215821820'),
        where("filtro", "==", 0),
       //where("createdAt", ">", timestampInic),
        //where("createdAt", "<", timestampFim),
        orderBy("createdAt", "desc") ,  
        limit(70)
      )
      );
    } else  if(id == '21582182000'){
      return await getDocs(query(this.medicoesCollection, 
        where("id", "==", '215821820'),
       // where("filtro2", "==", 0),
       //where("createdAt", ">", timestampInic),
        //where("createdAt", "<", timestampFim),
        orderBy("createdAt", "desc") ,  
        limit(100)
        )
      );
    } else {
      return await getDocs(query(this.medicoesCollection, 
        where("id", "==", id),
        where("filtro3", "==", 0),
       //where("createdAt", ">", timestampInic),
       // where("createdAt", "<", timestampFim),
        orderBy("createdAt", "desc") ,  
        limit(120)
      )
    );
    }
 
    
  }

  async getLogs(id: string){
    var _id = id

    if(id == '2195114000'){
      _id = '21951140'
    } else if(id == '21582182001'){
      _id = '215821820'
    }else  if(id == '21582182000'){
      _id = '215821820'
    } 


    // return this.db.object('monitoramento/'+id+'/medicao').valueChanges();
     return await getDocs(query(this.logsCollection, 
       where("0", "==", _id),
     //  where("filtro", "==", 0),
      //where("createdAt", ">", timestampInic),
      // where("createdAt", "<", timestampFim),
      orderBy("createdAt", "desc"), 
       limit(30)
       )
     );
     //return this.db.object('medidores/'+id+'/medicao').valueChanges();
   }
}
