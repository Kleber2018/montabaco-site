import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-versionamento',
  templateUrl: './versionamento.component.html',
  styleUrls: ['./versionamento.component.css']
})
export class VersionamentoComponent implements OnInit, OnDestroy {
  private end: Subject<boolean> = new Subject();

  public versoes = [
    { 
      versao: '3.0.0',
      data: '02/08/21',
      descricao: 'Atualizando projeto do Angular v9 para o v10'
    },
    { 
      versao: '2.8.8',
      data: '29-28-27-22/07/21',
      descricao: 'Filtro de tempo SSE, MGE melhorias, SDE'
    },
    { 
      versao: '2.8.6',
      data: '13/05/21',
      descricao: 'Correção de erros validação SSE e pdf SSE'
    },
    { 
      versao: '2.8.5',
      data: '04/05/21',
      descricao: 'Refatorado SDE e RME, melhorado validação form SSE, tab de controle no PDF SSE'
    },
    { 
      versao: '2.8.4',
      data: '27/04/21',
      descricao: 'Removido Módulo RME, Adc módulo SDE(ainda não terminado)'
    },
    { 
      versao: '2.8.2',
      data: '20/04/21',
      descricao: 'Exporte RME em XLSX'
    },
    { 
      versao: '2.8.1',
      data: '18-22-26/03/21',
      descricao: 'Módulo Usuário, correções bug rules, sort seconds'
    },
    { 
      versao: '2.8.0',
      data: '15-16-17/03/21',
      descricao: 'Correções de privilégios, mge e rme'
    },
    { 
      versao: '2.7.9',
      data: '24/02/21',
      descricao: 'Correções algoritimo de análise de MGEs'
    },
    { 
      versao: '2.7.8',
      data: '03-08-12/02/21',
      descricao: 'Log Eventos RME'
    }, 
    { 
      versao: '2.7.6',
      data: '26/01/21',
      descricao: 'Refatorado módulo RME, correção de erro upload de imagem'
    },  
    { 
      versao: '2.7.5',
      data: '21/01/21',
      descricao: 'Refatorado módulo RME (logs, pdf, form)'
    },  
    { 
      versao: '2.7.4',
      data: '22/12/2020',
      descricao: 'Refatorado dialog detalhes das medições anteriores'
    },   
    { 
      versao: '2.7.3',
      data: '18/12/2020',
      descricao: 'Refatorado estrutura MGE'
    },   
    { 
      versao: '2.7.2',
      data: '17/12/2020',
      descricao: 'Refatorado módulo RME'
    },    
    { 
      versao: '2.7.1',
      data: '11/12/2020',
      descricao: 'Adcionado tela de versionamento, perfil e RME'
    },
    { 
      versao: '2.7.0',
      data: '10/12/2020',
      descricao: 'Adcionado botão adicionar foto em lista de SSE, adicionado campo busca SSE pelo patrimônio, correção de validação em MGE'
    },
    { 
      versao: '2.0.0',
      data: '07/05/2020',
      descricao: 'Implementado Módulo de SSE'
    },
   
    { 
      versao: '1.0.0',
      data: '23/03/2020',
      descricao: 'Iniciado desenvolvimento'
    },
  ]
    
  constructor() { }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

}
