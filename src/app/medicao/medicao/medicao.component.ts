import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { Observable, Subject } from 'rxjs';
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
   
    console.log(this.item)
    
    //db.child("numero_serie").child("medicao").set(data, user['idToken']) #edita o mesmo arquivo

   
  }

  ngOnInit(): void {
    this.inicializando()
  }


  async inicializando(){
    const ref = this.db.object('numero_serie').valueChanges();

    await ref.subscribe(async d => {console.log('d',d)
      const r = d
      console.log(r['medicao'])
      this.medicao = r['medicao']

      }
      )
  }
}
