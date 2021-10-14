import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
// import { DemandService } from 'src/app/demand/demand.service';
import { PresenceService } from 'src/app/authentication/presence.service';
import { Usuario } from '../../usuario/usuario.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  @Input() public title = '';
  @Input() public iconName = '';

  public usuarioStatus = 'Carregando';
  public checked = false; 
  public disabled = false;
  presence$;

  constructor( private presenceService: PresenceService
              ) { 
   
  }

  ngOnInit(): void {

    const usuario: Usuario = sessionStorage.getItem('usuario')
    ? JSON.parse(sessionStorage.getItem('usuario'))
    : null;


  if (usuario) {
    this.presence$ = this.presenceService.getPresence(usuario.uid);


    this.atualizarpresenca();

    this.presence$.subscribe(res => {

      if(res){
        if(res.status == 'offline'){
          // if(this.empresaStatus == '1-on'){
          //   this.empresaStatus= '3-des';
          // }
          this.usuarioStatus = 'Desconectado'
          this.disabled = true
        } else if(res.status == 'online'){
          // if(this.empresaStatus == '3-des'){
          //   this.empresaStatus= '1-on';
          // }
          this.disabled = false
          this.usuarioStatus = 'Conectado'
        }
      } else {
        this.usuarioStatus = 'Desconectado'
        this.disabled = true
      }

    })
  }    
   }


   //atualiza o status a cada 10 minutos
   atualizarpresenca(){
    setInterval(t => {
        this.presenceService.setPresence('Conectado')
    },600000)
   }
   

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
