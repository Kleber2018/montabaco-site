import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';

/**Models.*/

import { AngularFireAuth } from '@angular/fire/auth';
import { first, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    console.log('let there be presence');
    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway();
  }

  getPresence(uid: string) {
    return this.db.object(`status/${uid}`).valueChanges();
  }

  getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }


 async setPresence(status: string) {
    const user = await this.getUser();
    if (user) {
      return this.db.object(`status/${user.uid}`).update({ status, timestamp: this.timestamp });
    }
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // Updates status when logged-in connection to Firebase starts
  updateOnUser() {
    const connection = this.db.object('.info/connected').valueChanges().pipe(
      map(connected => connected ? 'online' : 'offline')
    );

    return this.afAuth.authState.pipe(
      switchMap(user =>  user ? connection : of('offline')),
      tap(status => this.setPresence(status))
    );
  }

  updateOnDisconnect() {
    return this.afAuth.authState.pipe(
      tap(user => {
        if (user) {
          this.db.object(`status/${user.uid}`).query.ref.onDisconnect()
            .update({
              status: 'desconectado',
              timestamp: this.timestamp
          });
        }
      })
    );
  }

  async signOut() {
      await this.setPresence('offline');
      await this.afAuth.auth.signOut();
  }

   // User navigates to a new tab, case 3
   updateOnAway() {
    document.onvisibilitychange = (e) => {

      if (document.visibilityState === 'hidden') {
        this.setPresence('away');
      } else {
        this.setPresence('online');
      }
    };
  }





  // VerificaPresenceRealTimeBD(){
  //   // Fetch the current user's ID from Firebase Authentication.
  //   var uid = firebase.auth().currentUser.uid;

  // // Crie uma referência ao nó de status específico deste usuário.
  //   // É aqui que vamos armazenar dados sobre estar online / offline.
  //   var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);


  //   // Criaremos duas constantes nas quais escreveremos
  //   // o banco de dados em tempo real quando este dispositivo está offline
  //   // ou online.
  //   var isOfflineForDatabase = {
  //       state: 'offline',
  //       last_changed: firebase.database.ServerValue.TIMESTAMP,
  //   };

  //   var isOnlineForDatabase = {
  //       state: 'online',
  //       last_changed: firebase.database.ServerValue.TIMESTAMP,
  //   };

    
  //   // Crie uma referência ao caminho '.info / conectado' especial em
  //   // Banco de dados em tempo real. Esse caminho retorna `true 'quando conectado
  //   // e `false` quando desconectado.
  //   firebase.database().ref('.info/connected').on('value', function(snapshot) {
  //     // If we're not currently connected, don't do anything.
  //     if (snapshot.val() == false) {
  //         return;
  //     };

      
  //     // Se estamos conectados no momento, use o 'onDisconnect ()'
  //     // método para adicionar um conjunto que será acionado apenas uma vez
  //     // o cliente foi desconectado fechando o aplicativo,
  //     // perda de internet ou qualquer outro meio.
  //     userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
  //         // The promise returned from .onDisconnect().set() will
  //         // resolve as soon as the server acknowledges the onDisconnect()
  //         // request, NOT once we've actually disconnected:
  //         // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

  //         // We can now safely set ourselves as 'online' knowing that the
  //         // server will mark us as offline once we lose connection.
  //         userStatusDatabaseRef.set(isOnlineForDatabase);
  //     });
  //   });
  // } 
}
