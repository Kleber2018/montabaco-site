import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/firestore';
import { Usuario } from '../usuario/usuario.model';

/**Models.*/


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuario: AngularFirestoreCollection<Usuario>;

  constructor(
    private angularFirestore: AngularFirestore
  ) {
    this.usuario = angularFirestore.collection<Usuario>('user');
  }


  public getUsuario(id: string): Observable<Usuario> {
    return this.usuario.doc<Usuario>(id).valueChanges();
  }

  public getUsuarioByEMail(eMail: string): Observable<Usuario[]> {
    const usuario: AngularFirestoreCollection<Usuario> = this.angularFirestore.collection('user', ref => ref.where('email', '==', eMail));
    return usuario.valueChanges();
  }

  public saveUsuario(object: Usuario): Promise<firebase.firestore.DocumentReference> {
    return this.usuario.add(object);
  }

  public upateUsuario(object: Usuario): Promise<void> {
    return this.usuario.doc(object.uid).update(object);
  }

  public deleteUsuario(id: string): Promise<void> {
    return this.usuario.doc(id).delete();
  }
}
