import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-servico-dialog',
  templateUrl: './servico-dialog.component.html',
  styleUrls: ['./servico-dialog.component.css']
})
export class ServicoDialogComponent {


  // public servicos: [
  //   'AJUSTAR', 
  //   'ALTERAR',
  //   'DEENVOLVIMENTO TÉCNICO',
  //   'FABRICAR',
  //   'FISCALIZAR',
  //   'INSPECIONAR',
  //   'INSTALAR',
  //   'LIMPAR',
  //   'LUBRIFICAR',
  //   'MANOBRAR',
  //   'MEDIR',
  //   'REFORMAR',
  //   'RETIRAR',
  //   'REVESTIR',
  //   'REVISAR',
  //   'SERVIÇOS ADM',
  //   'SOLDAR',
  //   'SUBSTITUIR',
  //   'TESTAR',
  //   'TRANSPORTAR',
  //   'TREINAR',
  //   'TROCAR EQUIPAMENTO',
  //   'USINAR'
  // ]

  public servicos = [
    { cod: 'S', titulo: 'SUBSTITUIR'},
    { cod: 'Z', titulo: 'TROCAR EQUIPAMENTO'},
    { cod: 'U', titulo: 'USINAR'},
    { cod: 'A', titulo: 'AJUSTAR'},
    { cod: 'B', titulo: 'ALTERAR'},
    { cod: 'P', titulo: 'DESENVOLVIMENTO TÉCNICO'},
    { cod: 'F', titulo: 'FISCALIZAR'},
    { cod: 'C', titulo: 'INSPECIONAR'},
    { cod: 'I', titulo: 'INSTALAR'},
    { cod: 'H', titulo: 'LIMPAR'},
    { cod: 'L', titulo: 'LUBRIFICAR'},
    { cod: 'W', titulo: 'MANOBRAR'},
    { cod: 'M', titulo: 'MEDIR'},
    { cod: 'Y', titulo: 'REFORMAR'},
    { cod: 'R', titulo: 'RETIRAR'},
    { cod: 'K', titulo: 'REVISAR'},
    { cod: 'N', titulo: 'ADM'},
    { cod: 'O', titulo: 'SOLDAR'},
    { cod: 'T', titulo: 'TESTAR'},
    { cod: 'Q', titulo: 'TRANSPORTAR'},
    { cod: 'X', titulo: 'FABRICAR'},
    { cod: 'J', titulo: 'REVESTIR'},
  ];

  public efeitos = [
    { cod: 'CFB', titulo: 'CONFIABILIDADE'},
    { cod: 'DEP', titulo: 'DESPERDÍCIO/PERDAS'},
    { cod: 'FDA', titulo: 'FALTA D AGUA'},
    { cod: 'IAB', titulo: 'IMPACTO AMBIENTAL'},
    { cod: 'INV', titulo: 'INOVAÇÃO'},
    { cod: 'IPD', titulo: 'INCREMENTO DE PRODUÇÃO'},
    { cod: 'IOP', titulo: 'INDISP. OPERACIONAL'},
    { cod: 'NCF', titulo: 'NÃO CONFORMIDADE'},
    { cod: 'ORG', titulo: 'ORGANIZAÇÃO GESTÃO'},
    { cod: 'SGR', titulo: 'SEGURANÇA'}
  ]

  public causas = [
    { 
      cod: 'AD',
      titulo: 'ADEQUAÇÃO',
      relacionadas: [{
        cod: 'ADA',
        titulo: 'Atualização'
      },
      {
        cod: 'ADI',
        titulo: 'Interna'
      },
      {
        cod: 'ADP',
        titulo: 'Padronização'
      },
      {
        cod: 'ADL',
        titulo: 'Legislação'
      },
      {
        cod: 'ADS',
        titulo: 'Segurança'
      },
      {
        cod: 'ADT',
        titulo: 'Técnica/Operacional'
      }]
    },
    { 
      cod: 'FA',
      titulo: 'FATORES DE AUTOMAÇÃO',
      relacionadas: [{
        cod: 'FAE',
        titulo: 'Sistema de Controle'
      },
      {
        cod: 'FAB',
        titulo: 'Instrum. Convencional'
      },
      {
        cod: 'FAA',
        titulo: 'Instrum. Analítica'
      },
      {
        cod: 'FAF',
        titulo: 'Comunicação'
      }]
    },
    { 
      cod: 'FE',
      titulo: 'FATORES ELÉTRICOS',
      relacionadas: [{
        cod: 'FEA',
        titulo: 'Aterramento'
      },
      {
        cod: 'FEB',
        titulo: 'Sensibilidade'
      },
      {
        cod: 'FEC',
        titulo: 'Curto-Circuito'
      },
      {
        cod: 'FEI',
        titulo: 'Baixa Isolação'
      },
      {
        cod: 'FEE',
        titulo: 'Componentes Elétricos'
      },
      {
        cod: 'FFF',
        titulo: 'Falta de Fase'
      },
      {
        cod: 'FEM',
        titulo: 'Mau Contato'
      },
      {
        cod: 'FET',
        titulo: 'Tensão (Sub e Sobre)'
      },
      {
        cod: 'FES',
        titulo: 'Sobrecorrente'
      }]
    },
    { 
      cod: 'FM',
      titulo: 'FATORES MECÂNICOS',
      relacionadas: [{
        cod: 'FMD',
        titulo: 'Desgaste'
      },
      {
        cod: 'FMC',
        titulo: 'Componentes'
      },
      {
        cod: 'FMB',
        titulo: 'Desalinhamento'
      },
      {
        cod: 'FMA',
        titulo: 'Atrito'
      },
      {
        cod: 'FML',
        titulo: 'Lubrificação'
      },
      {
        cod: 'FMR',
        titulo: 'Ruído'
      },
      {
        cod: 'FMZ',
        titulo: 'Vazamento'
      },
      {
        cod: 'FMV',
        titulo: 'Vibração'
      },
      {
        cod: 'FMM',
        titulo: 'Montagem Indevida'
      }]
    },
    { 
      cod: 'CV',
      titulo: 'CICLO DE VIDA',
      relacionadas: [{
        cod: 'CVC',
        titulo: 'Componentes'
      },
      {
        cod: 'CVE',
        titulo: 'Equipamentos'
      }]
    },
    { 
      cod: 'FO',
      titulo: 'FATORES OPERACIONAIS',
      relacionadas: [
      {
        cod: 'FOO',
        titulo: 'Operação indevida'
      },
      {
        cod: 'FOL',
        titulo: 'Conservação/Limpeza'
      },
      {
        cod: 'FOI',
        titulo: 'Incremento de Produção'
      },
      {
        cod: 'FOC',
        titulo: 'Capacitação'
      }]
    },
    { 
      cod: 'FX',
      titulo: 'FATORES EXTERNOS',
      relacionadas: [{
        cod: 'FXC',
        titulo: 'Corrosão'
      },
      {
        cod: 'FXD',
        titulo: 'Descarga Atmosférica (Surto)'
      },
      {
        cod: 'FXA',
        titulo: 'Animais'
      },
      {
        cod: 'FXG',
        titulo: 'Vegetação'
      },
      {
        cod: 'FXT',
        titulo: 'Temperatura'
      },
      {
        cod: 'FXV',
        titulo: 'Vendaval/Tempestade'
      },
      {
        cod: 'FXI',
        titulo: 'Inundação e Umidade'
      }]
    },
    { 
      cod: 'FV',
      titulo: 'FURTO e VANDALISMO',
      relacionadas: [{
        cod: 'FVC',
        titulo: 'Furto Componentes Elétricos'
      },
      {
        cod: 'FVE',
        titulo: 'Furto Equipamentos'
      },
      {
        cod: 'FVV',
        titulo: 'Vandalismo/Destruição'
      }]
    },
    { 
      cod: 'FD',
      titulo: 'FORNECEDORES',
      relacionadas: [{
        cod: 'FDE',
        titulo: 'Energia (concessionária)'
      },
      {
        cod: 'FDM',
        titulo: 'Materiais (fornecedores)'
      },
      {
        cod: 'FDT',
        titulo: 'Telêfonia (concessionária)'
      }]
    },
    { 
      cod: 'CT',
      titulo: 'CONSTRUTIVA',
      relacionadas: [{
        cod: 'CTE',
        titulo: 'Especificação Técnica'
      },
      {
        cod: 'CTO',
        titulo: 'Obra (execução)'
      },
      {
        cod: 'CTP',
        titulo: 'Projeto'
      }]
    },
    { 
      cod: 'PV',
      titulo: 'PREVENÇÃO',
      relacionadas: [{
        cod: 'PVD',
        titulo: 'Diagnóstico'
      },
      {
        cod: 'PVI',
        titulo: 'Inspeção Eletromecânica'
      },
      {
        cod: 'PVP',
        titulo: 'Manutenção Painéis Elétricos'
      },
      {
        cod: 'PVM',
        titulo: 'Medições Eletromecânicas'
      }]
    }
  ]

  public opcoes: any;
  public tipo: string; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ServicoDialogComponent>,) {
                this.tipo = data;
                console.log(this.tipo)
                if(data == 'SERVICO'){
                  this.opcoes = this.servicos;
                } else if(data == 'EFEITO'){
                  this.opcoes = this.efeitos;
                } else if(data == 'CAUSA'){
                  this.opcoes = this.causas;
                }
              }


  escolhendo(servico: {cod: string, titulo: string}) {
     this.dialogRef.close(servico);
  }

}
