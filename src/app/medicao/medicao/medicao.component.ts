import { Component, OnInit } from '@angular/core';
import { AngularFireAction, AngularFireDatabase } from '@angular/fire/compat/database';


import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-medicao',
  templateUrl: './medicao.component.html',
  styleUrls: ['./medicao.component.css']
})
export class MedicaoComponent implements OnInit {
  item
  
  public medicao;
  constructor(public db: AngularFireDatabase
    ) { 
    this.inicializando()
    
    //db.child("numero_serie").child("medicao").set(data, user['idToken']) #edita o mesmo arquivo

   
  }

  ngOnInit(): void {

  }

 
  async inicializando(){
    const ref = this.db.object('0000000016223e72/medicao').valueChanges();
    const ref2 = this.db.list('0000000016223e72/medicoes', ref =>   ref.limitToLast(20) ).valueChanges()

    ref2.subscribe(items => items.forEach(item => { 
      console.log('item', item);
    }));


    ref.subscribe(d => {
        this.medicao = d
      }
      )


  }
}
