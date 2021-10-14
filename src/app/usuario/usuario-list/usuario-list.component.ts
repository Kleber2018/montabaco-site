import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Usuario } from '../usuario.model';
import { UsuarioService } from '../usuario.service';


@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit, OnDestroy {
  private end: Subject<boolean> = new Subject();
  public usuarios: Usuario[];

  constructor(private usuarioService: UsuarioService,) { 
    this.carregaUsuarios()
  }

  ngOnInit(): void {
  }


  carregaUsuarios(){
    this.usuarioService.getUsuarios().pipe(takeUntil(this.end)).subscribe(res => {
      this.usuarios = res.map(e => {
        return {
          uid: e.payload.doc.id,
          nome: e.payload.doc.data().nome,
          sobrenome: e.payload.doc.data().sobrenome,
          email: e.payload.doc.data().email,
          privilegio: e.payload.doc.data().privilegio,
          equipe: e.payload.doc.data().equipe,
          updatedAt: e.payload.doc.data().updatedAt,
          createdAt: e.payload.doc.data().createdAt,
          rules: e.payload.doc.data().rules
        };
      });
      this.usuarios.sort((a, b) => {
        return +b.nome - +a.nome;
      });
      console.log(this.usuarios);
    });
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

}
