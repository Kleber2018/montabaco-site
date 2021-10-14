import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection, AngularFirestoreCollectionGroup,
  DocumentChangeAction,
  DocumentReference
} from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import {AngularFireFunctions} from '@angular/fire/functions';
import {Mge} from './mge.model';
import { first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MgeService {

  private mgeCollection: AngularFirestoreCollection<Mge>;
  private mgeCollectionGroup: AngularFirestoreCollectionGroup<Mge>;
  private mgeWhereCollection: AngularFirestoreCollection<Mge>;
  private enumCollection: AngularFirestoreCollection<any>;
  private task: AngularFireUploadTask;
  private callableMgesViewTratada: any;

  constructor(protected db: AngularFirestore,
              protected where: AngularFirestore,
              private storage: AngularFireStorage,
              private fns: AngularFireFunctions) {
    this.mgeCollection = db.collection<Mge>('mge');
    this.enumCollection = db.collection<any>('enum');
    this.callableMgesViewTratada = this.fns.httpsCallable('mgesAnalise');
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  public async getmgesViewTratada(loc: string){
    return await this.callableMgesViewTratada(loc).pipe(first()).toPromise().then(res => {
          return res
        })
  }

  getTimeZone() {
    return new Date().toString();
  }

  // para salvar em lote
  addMges(oses: any[], usuario: any, periodo: string) {
    if (oses.length < 249) {
      console.log('mge service', oses, oses.length, usuario);
      // --create batch--
      const batch = this.db.firestore.batch();
      // --create a reference--
      oses.forEach(ose => {
        // convertendo data excel para timestamp
        ose.data = new Date((ose.data - (25567 + 1)) * 86400 * 1000);
        ose.prazo = new Date((ose.prazo - (25567 + 1)) * 86400 * 1000);
        ose.periodo = periodo;
        const uid = ose.ose;
        // delete mge.uid;
        // delete usuario.rules;
        const userRef = this.mgeCollection.doc(uid).ref;
        batch.set(userRef, {
          uid,
          usuario: '',
          OSE: ose,
          MGE: {},
          status: '1-pendente',
          updatedAt: this.timestamp,
          createdAt: this.timestamp
        });
      });

      return batch.commit()
          .then(() => console.log('salvo com sucesso'))
          .catch(er => console.error('erro no salvar MGEs', er));
    } else {
      alert("precisa ter menos de 250 linhas");
    }
  }




  

  addMge(mge: Mge) {
    return this.mgeCollection.add({
      ...mge,
      updatedAt: this.timestamp,
      createdAt: this.timestamp
    })
        .then(() => console.log('salvo com sucesso'))
        .catch(er => console.error('erro no slavar gestor', er));
  }

  getMges() {
    return this.mgeCollection.snapshotChanges(); // mantem atualizado em realtime
  }


  public getMge(id: string): Observable<any> {
    return this.mgeCollection.doc<any>(id).valueChanges();
  }

  public updateMge(mgeUpdade: Mge) {
    return this.mgeCollection.doc(mgeUpdade.uid).update({...mgeUpdade, updatedAt: this.timestamp });
  }

  public updtMedicoes(uid: string, mgeUpdade: any, data_execucao: Date, usuario: {nome: string, email: string}, hora: any, qtd_equipamentos: number) {

    var dataLocal = new Date(data_execucao);
    var dia = dataLocal.getDate();
    var mes = dataLocal.getMonth();
    var ano = dataLocal.getFullYear();
    
    var timestampExecucao= firebase.firestore.Timestamp.fromDate(new Date(ano,mes,dia))
    return this.mgeCollection.doc(uid).update({
      MGE: mgeUpdade, 
      status: '7-executada', 
      updatedAt: this.timestamp, 
      'OSE.data_execucao': timestampExecucao, 
      usuario: usuario, 
      hora: hora,
      'OSE.qtd_equipamentos': qtd_equipamentos
    });
  }


  // UPLOADFILE
  public async uploadFile( fileImg: any, id: string, imgs: any, loc: string) {
    const dataLocal = new Date();
    const mes = dataLocal.getMonth();
    const ano = dataLocal.getFullYear();
    const nomeImagem = dataLocal.getTime()+' ('+(mes+1)+'-'+ano+') '+id;
    const path = 'mge/' + ano + '/' + loc + '/' + nomeImagem;
    const fileRef = this.storage.ref(path.replace(/\s/g, ''));
    this.task = this.storage.upload(path.replace(/\s/g, ''), fileImg);
    return await this.task.then(up => {

      // fileRef.getDownloadURL().subscribe(url => {
      //   this.updateUrl(id, url, imgs);
      // });


      return fileRef.getDownloadURL().toPromise().then(url => {
        this.updateUrl(id, url, imgs);
        return true;
      }).catch(() => false);
    });
  }

  private updateUrl(id: string, valor: string, imgs: any): Promise<void> {
    if (imgs.length == 0) {
      imgs = [valor];
    } else {
      imgs.push(valor);
    }
    return this.mgeCollection.doc(id).update({img : imgs}).then(() => { });
  }

  public updateDeleteUrl(id: string, imgs: any): Promise<void> {
    return this.mgeCollection.doc(id).update({img : imgs});
  }

  public getPreventivasPendentesWhere(equipe: string, periodo: string): Observable<DocumentChangeAction<Mge>[]> {

    // var dataLocalInic = new Date(dataInic);
    // var diaI = dataLocalInic.getDate();
    // var mesI = dataLocalInic.getMonth();
    // var anoI = dataLocalInic.getFullYear();
    //
    // var dataLocalFim = new Date(dataFim);
    // var diaF = 1 + dataLocalFim.getDate();
    // var mesF = dataLocalFim.getMonth();
    // var anoF = dataLocalFim.getFullYear();

    // var timestampInic= firebase.firestore.Timestamp.fromDate(new Date(anoI,mesI,diaI))
    // var timestampFim= firebase.firestore.Timestamp.fromDate(new Date(anoF,mesF,diaF))
    if(equipe == 'all'){
      this.mgeWhereCollection = this.where.collection('mge', ref => ref
      .where('OSE.periodo', '==', periodo)
      .where('status', '==', '1-pendente'));
    } else if(equipe == 'GRGA' || equipe == 'GRPG' || equipe == 'GRUV' || equipe == 'GRTB'){
      this.mgeWhereCollection = this.where.collection('mge', ref => ref
      .where('OSE.gerencia', '==', equipe)
      .where('OSE.periodo', '==', periodo)
      .where('status', '==', '1-pendente'));
    }  else {
      this.mgeWhereCollection = this.where.collection('mge', ref => ref
      .where('OSE.equipe', '==', equipe)
      .where('OSE.periodo', '==', periodo)
      .where('status', '==', '1-pendente'));
    }
    
    return this.mgeWhereCollection.snapshotChanges();
  }


  public getPreventivasExecutadasWhere(equipe: string, periodo: string): Observable<DocumentChangeAction<Mge>[]> {

    if(equipe == 'all'){
      this.mgeWhereCollection = this.where.collection('mge', ref => ref
      .where('OSE.periodo', '==', periodo)
      .where('status', '==', '7-executada'));
    } else if(equipe == 'GRGA' || equipe == 'GRPG' || equipe == 'GRUV' || equipe == 'GRTB'){
      this.mgeWhereCollection = this.where.collection('mge', ref => ref
      .where('OSE.gerencia', '==', equipe)
      .where('OSE.periodo', '==', periodo)
      .where('status', '==', '7-executada'));
    }  else {
      this.mgeWhereCollection = this.where.collection('mge', ref => ref
      .where('OSE.equipe', '==', equipe)
      .where('OSE.periodo', '==', periodo)
      .where('status', '==', '7-executada'));
    }
    return this.mgeWhereCollection.snapshotChanges();
  }

  public getPreventivasLocWhere(loc: string): any {
//Promise<any>
    console.log(loc)

    this.mgeWhereCollection = this.where.collection('mge', ref => ref
      .where('OSE.loc', '==', loc)
      .where('status', '==', '7-executada')
    );
  
    return this.mgeWhereCollection.snapshotChanges()

    //return this.mgeWhereCollection.valueChanges().subscribe((datas) => { console.log("datas", datas) },(err)=>{ console.log("probleme : ", err) });
   // return this.mgeWhereCollection.valueChanges().toPromise().then(data => { console.log(data); return data})
    /*return  this.mgeWhereCollection.valueChanges().pipe(first()).toPromise().then(res => { 
      console.log(res)
      return  res.map(e => {
        return {
          uid: e.uid,
          MGE: e.MGE,
          OSE: e.OSE,
          updatedAt: e.updatedAt
        };
    });
  })
*/

  }

  /*
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

*/
  // console.log('no service', this.pedidosWhereCollection.valueChanges().pipe(first()).toPromise().then(res => {
      //   console.log(res.length)
      //   return res
      // }))


  // public async getSolicitacaoPDF(uid: string){
  //   return await this.callableSolicitacaoImgBase64({uid}).pipe(first()).toPromise().then(res => {
  //     return res
  //   })
  // }

  // public getSolicitacaoDataWhere(dataInic: Date, dataFim: Date, status: string, usuarioUID?: string, visualizarTodos?: boolean, setor?: string): Observable<DocumentChangeAction<Solicitacao>[]> {
  //
  //   var dataLocalInic = new Date(dataInic);
  //   var diaI = dataLocalInic.getDate();
  //   var mesI = dataLocalInic.getMonth();
  //   var anoI = dataLocalInic.getFullYear();
  //
  //   var dataLocalFim = new Date(dataFim);
  //   var diaF = 1 + dataLocalFim.getDate();
  //   var mesF = dataLocalFim.getMonth();
  //   var anoF = dataLocalFim.getFullYear();
  //
  //   var timestampInic= firebase.firestore.Timestamp.fromDate(new Date(anoI,mesI,diaI))
  //   var timestampFim= firebase.firestore.Timestamp.fromDate(new Date(anoF,mesF,diaF))
  //
  //   if(visualizarTodos){
  //     this.solicitacaoWhereCollection = this.where.collection('solicitacao', ref => ref
  //         .where('status', '==', status)
  //         .where('setor', '==', setor)
  //         .where('createdAt', '>', timestampInic)
  //         .where('createdAt', '<', timestampFim));
  //   } else {
  //     this.solicitacaoWhereCollection = this.where.collection('solicitacao', ref => ref
  //         .where('status', '==', status)
  //         .where('setor', '==', setor)
  //         .where('usuario.uid', '==', usuarioUID)
  //         .where('createdAt', '>', timestampInic)
  //         .where('createdAt', '<', timestampFim));
  //   }
  //   return this.solicitacaoWhereCollection.snapshotChanges();
  // }
  //
  //
  // public async updtOSEDCASolicitacao(idSolicitacao: string, OSE: string, DCA: string, identificacao: string, obs: string, setor: string){
  //   return this.solicitacaoCollection.doc(idSolicitacao).update({'OSE.OS_CODIGO': OSE, 'OSE.DCA' : DCA, 'EQUIPAMENTO.identificacao': identificacao, 'SERVICO.obs': obs, 'setor': setor, 'updatedAt' : this.timestamp});
  // }
  //
  //
  // //1-pendende, 2-aceito, 3-cancelado
  // public async updtStatusSolicitacao(idSolicitacao: string, status: string, statusBefore: string, referSSE?:string){
  //   if(status=='2-aceito'){
  //     if(statusBefore == '1-pendente'){
  //       var numero = await this.getNumSolicitacao('numero_sse').pipe(first()).toPromise().then(res => {
  //         return res.numero;
  //       });
  //       this.enumCollection.doc<any>('numero_sse').update({
  //         numero: firebase.firestore.FieldValue.increment(1)
  //       })
  //       return this.solicitacaoCollection.doc(idSolicitacao).update({'status' : status, 'referencia': numero, 'updatedAt' : this.timestamp});
  //     } else if(statusBefore=='3-cancelado'){
  //       if(referSSE){
  //         return this.solicitacaoCollection.doc(idSolicitacao).update({'status' : status, 'updatedAt' : this.timestamp});
  //       } else {
  //         var numero = await this.getNumSolicitacao('numero_sse').pipe(first()).toPromise().then(res => {
  //           return res.numero;
  //         });
  //         this.enumCollection.doc<any>('numero_sse').update({
  //           numero: firebase.firestore.FieldValue.increment(1)
  //         })
  //         return this.solicitacaoCollection.doc(idSolicitacao).update({'status' : status, 'referencia': numero, 'updatedAt' : this.timestamp});
  //       }
  //     }
  //
  //   }else {
  //     return this.solicitacaoCollection.doc(idSolicitacao).update({'status' : status, 'updatedAt' : this.timestamp});
  //   }
  // }
  //
  //
  // public getNumSolicitacao(id: string): Observable<any> {
  //   return this.enumCollection.doc<any>(id).valueChanges();
  // }
  //
  //
  // // UPLOADFILE
  // public uploadFile( fileImg: any, id: string, imgs: any): void {
  //   var dataLocal = new Date();
  //   var mes = dataLocal.getMonth();
  //   var ano = dataLocal.getFullYear();
  //   var nomeImagem = dataLocal.getTime();
  //   const path = 'solicitacao/'+ano+'/'+mes+'/'+id + '/' + nomeImagem;
  //   const fileRef = this.storage.ref(path.replace(/\s/g, ''));
  //   this.task = this.storage.upload(path.replace(/\s/g, ''), fileImg);
  //   this.task.then(up => {
  //     fileRef.getDownloadURL().subscribe(url => {
  //       this.updateUrl(id, url, imgs);
  //     });
  //   });
  // }
  //
  // private updateUrl(id: string, valor: string, imgs: any): Promise<void> {
  //   if(imgs.length == 0){
  //     imgs = [valor];
  //   } else {
  //     imgs.push(valor);
  //   }
  //   return this.solicitacaoCollection.doc(id).update({"img" : imgs}).then(() => { });
  // }
  //
  // public updateDeleteUrl(id: string, imgs: any): Promise<void> {
  //   return this.solicitacaoCollection.doc(id).update({"img" : imgs});
  // }
  //
  //

  // public sfDocRef: any;
  // criando pedido
  // async addPedido(solicitacao: Solicitacao) {
  //      return  await this.empresasCollection.doc<Empresa>(pedido.id_empresa).get().toPromise().then(
  //         snapshot => {
  //           let retorno = 'erro'
  //           if(snapshot.exists){
  //             if(!snapshot.metadata.fromCache){
  //                 if(snapshot.data().status == '1-on'){

  //                   // console.log('mge online')
  //                   retorno = 'salvo'
  //                 } else {
  //                   retorno = 'empresaOff';
  //                   // console.log('mge offline')
  //                 }
  //                 // snapshot.data
  //             } else {
  //               retorno = 'offline';
  //               // console.log('vem do cach')
  //             }
  //           } else {
  //             retorno = 'erro';
  //           }
  //           if(retorno == 'salvo'){
  //             // console.log('dentro o if')
  //             this.pedidosCollection.add({
  //               ...pedido,
  //                 log_criado: this.timestamp
  //             }).catch((erro: any) => {
  //               console.log('erro 33', erro);
  //               return 'erro';
  //               });
  //           }
  //           return retorno
  //         }
  //         // e.payload.doc.data().categoria,
  //       )
  //       // console.log('fora', valor);
  //       const timestamp = this.timestamp;
  //       return this.pedidosCollection.add({
  //         ...pedido,
  //           log_criado: timestamp
  //       }).catch((erro: any) => {
  //         console.log('erro 33', erro);
  //         return false;
  //         });


  //       // try {
  //       //   await this.empresaService.getEmpresa(this.pedido.id_empresa).pipe(first()).toPromise().then(res => {
  //       //     console.log('res no then do pedido', res);
  //       //     if(res){
  //       //       retornoOk = true
  //       //       empresaVerifica = res
  //       //     } else {
  //       //       retornoOk = false
  //       //     }
  //       //   });
  //       // } catch (error) {
  //       //   console.log('307',error)
  //       // }
  // // })



  // funcionando
  // this.empresasCollection.doc<Empresa>(pedido.id_empresa).get().toPromise().then(
  //   snapshot => {
  //     vemDoCache = snapshot.metadata.fromCache
  //     console.log(snapshot.metadata.fromCache)
  //     if(snapshot.exists){
  //       if(!snapshot.metadata.fromCache){
  //           if(snapshot.data().status == '1-on'){
  //             console.log('mge online')
  //           } else {
  //             console.log('mge offline')
  //           }
  //           // snapshot.data
  //         console.log('vem da internet', snapshot.exists,  snapshot.id, snapshot.data().status)
  //       } else {
  //         console.log('vem do cach')
  //       }
  //   }
  //   },
  //   // e.payload.doc.data().categoria,
  // )
  // this.pedidosCollection.add({
  // get timestamp() {
  //   return firebase.firestore.FieldValue.serverTimestamp();
  // }
  // /**
  //  * Empresa
  //  */
  // getEmpresas(): Observable<DocumentChangeAction<Empresa>[]> {
  //   return this.empresasCollection.snapshotChanges();
  // }
  //
  // updtEmpresaPush(idEmpresa: string, gestores: { push: string, uid: string, createdAt: any }[]){
  //   return this.empresasCollection.doc(idEmpresa).update({
  //     'gestores': gestores
  //   }).then(function() {
  //     console.log("push atualizado");
  //   });
  // }
  //
  // public getEmpresaWhere(campo: string, operador: any, valor: string): Observable<DocumentChangeAction<Empresa>[]> {
  //   this.empresasWhereCollection = this.where.collection('empresa', ref => ref.where(campo, operador, valor));
  //   return this.empresasWhereCollection.snapshotChanges();
  // }
  //
  // public getEmpresa(id: string): Observable<Empresa> {
  //   return this.empresasCollection.doc<Empresa>(id).valueChanges();
  // }
  //
  // public updateEmpresa(colecao: Empresa, id: string): Promise<any> {
  //   return this.empresasCollection.doc(id).update(colecao);
  // }
  //
  // public updateStatusEmpresa(status: string, id: string): Promise<void> {
  //   return this.empresasCollection.doc(id).update({'status' : status}).then(() => { });
  // }
  //
  // private updateEmpresaUrlLogo(id: string, valor: string): Promise<void> {
  //   return this.empresasCollection.doc(id).update({"url.img_logo" : valor}).then(() => { });
  // }
  //
  // private updateEmpresaUrlPerfil(id: string, valor: string): Promise<void> {
  //   return this.empresasCollection.doc(id).update({"url.img_perfil_pc" : valor}).then(() => { });
  // }
  //
  // private updateEmpresaUrlPerfilP(id: string, valor: string): Promise<void> {
  //   return this.empresasCollection.doc(id).update({"url.img_perfil_cel" : valor}).then(() => { });
  // }
  //
  // public addEmpresa(empresa: Empresa): Promise<void> {
  //   return this.empresasCollection.add(empresa).then(
  //     function(docRef) {
  //       console.log('ID linha 61: ', docRef.id); // iMPLEMENTAR: PRECISO RETORNAR ESSE ID NO EMPRESA-FORM.COMPONENT
  //   })
  //   .catch( function(error) {
  //       console.error('Erro ao salvar mge: ', error);
  //   });
  // }
  //
  // public uploadFileLogo( fileLogo: any, id: string): void {
  //   const path = id + '/logo';
  //   const fileRef = this.storage.ref(path.replace(/\s/g, ''));
  //   this.task = this.storage.upload(path.replace(/\s/g, ''), fileLogo);
  //   this.task.then(up => {
  //     fileRef.getDownloadURL().subscribe(url => {
  //       this.updateEmpresaUrlLogo(id, url);
  //     });
  //   });
  // }
  //
  // public uploadFilePerfil(filePerfil: any, id: string): void {
  //   const path2 = id + '/perfil';
  //   const fileRef2 = this.storage.ref(path2.replace(/\s/g, ''));
  //   this.task = this.storage.upload(path2.replace(/\s/g, ''), filePerfil);
  //   this.task.then(up => {
  //     fileRef2.getDownloadURL().subscribe(url2 => {
  //       this.updateEmpresaUrlPerfil(id, url2);
  //     });
  //   });
  // }
  //
  // public uploadFilePerfilP(filePerfil: any, id: string): void {
  //   const path3 = id + '/perfil_p';
  //   const fileRef3 = this.storage.ref(path3.replace(/\s/g, ''));
  //   this.task = this.storage.upload(path3.replace(/\s/g, ''), filePerfil);
  //   this.task.then(up => {
  //     fileRef3.getDownloadURL().subscribe(url2 => {
  //       this.updateEmpresaUrlPerfilP(id, url2);
  //     });
  //   });
  // }
  //
  // public delEmpreas(id: string): Promise<void> {
  //   return this.empresasCollection.doc(id).delete();
  // }
  //
  // /**
  //  * Produto
  //  */
  // public addProduto(produto: Produto): Promise<DocumentReference> {
  //   return this.produtosCollection.add(produto);
  // }
  //
  // public updateProduto(colecao: Produto, id: string): Promise<void> {
  //   return this.produtosCollection.doc(id).update(colecao);
  // }
  //
  // public getProduto(id: string): Observable<Produto> {
  //   return this.produtosCollection.doc<Produto>(id).valueChanges();
  // }
  //
  // public getProdutoWhere(empresa: string, operador: any, id: string): Observable<DocumentChangeAction<Produto>[]> {
  //   this.produtosWhereCollection = this.where.collection('produto', ref => ref.where(empresa, operador, id));
  //   return this.produtosWhereCollection.snapshotChanges();
  // }
  //
  // public uploadFileProduto(fileProduto: any, idEmpresa: string, tipo: string, idProduto: string): void {
  //   const path2 = idEmpresa + '/' + tipo + '/' + idProduto;
  //   const fileRef2 = this.storage.ref(path2.replace(/\s/g, ''));
  //   this.task = this.storage.upload(path2.replace(/\s/g, ''), fileProduto);
  //   this.task.then(up => {
  //     fileRef2.getDownloadURL().subscribe(url2 => {
  //       this.updateProdutoUrlImg(idProduto, url2);
  //     });
  //   });
  // }
  //
  // private updateProdutoUrlImg(id: string, valor: string): Promise<void> {
  //   return this.produtosCollection.doc(id).update({url_imagem : valor}).then(() => { });
  // }
  //
  // public updateStatusProduto(status: string, id: string): Promise<void> {
  //   return this.produtosCollection.doc(id).update({'status' : status}).then(() => { });
  // }
  //
  // /**
  //  * Produto Opc
  //  */
  // public getOpcionaisProdutoWhere(id: string, tipo: string): Observable<DocumentChangeAction<ProdutoOpc>[]> {
  //   this.produtosOpcWhereCollection = this.where
  //     .collection(
  //       'produto_opc',
  //       ref => ref
  //         .where('id_empresa', '==', id)
  //         .where('tipo', '==', tipo)
  //       )
  //     ;
  //   return this.produtosOpcWhereCollection.snapshotChanges();
  // }
  //
  // public getOpcional(id: string): Observable<ProdutoOpc> {
  //   return this.produtosOpcCollection.doc<ProdutoOpc>(id).valueChanges();
  // }
  //
  // public addOpcional(opcional: ProdutoOpc): Promise<DocumentReference> {
  //   return this.produtosOpcCollection.add(opcional);
  // }
  //
  // public updtOpcional(opcional: ProdutoOpc, id: string): Promise<void> {
  //   return this.produtosOpcCollection.doc(id).update(opcional);
  // }
  //
  // public updateStatusOpcional(status: string, id: string): Promise<void> {
  //   return this.produtosOpcCollection.doc(id).update({'status' : status}).then(() => { });
  // }
  //
  // /**
  //  * Categoria
  //  */
  // public getCategorias(): Observable<DocumentChangeAction<firebase.firestore.DocumentData>[]> {
  //   return this.categoriasCollection.snapshotChanges();
  // }
}
