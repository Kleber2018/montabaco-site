import { Component, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import { Usuario } from 'src/app/usuario/usuario.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import {Mge} from '../../mge.model';
import {MgeService} from '../../mge.service';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Label } from 'ng2-charts/lib/base-chart.directive';
import { Color, ThemeService } from 'ng2-charts';

import { ChartDataSets, ChartOptions, ChartType  } from 'chart.js';

type Theme = 'light-theme' | 'dark-theme';

@Component({
  selector: 'app-mge-dialog',
  templateUrl: './mge-dialog.component.html',
  styleUrls: ['./mge-dialog.component.css']
})
export class MgeDialogComponent {
  public mge: Mge;
  //public mges: Mge[];
  public usuario: Usuario;
  //public medicoes = [[],[],[],[],[],[],[]];
  
  //public correntes = [[],[],[],[],[],[],[],[]];
  //public tensoes = [[],[],[],[],[],[],[]];
  public correntes: any =  []
  public horimetrosData = []
  public horimetros: any =  []
  public carregando: boolean = true

  public horasOperacao: any =  []

  private end: Subject<boolean> = new Subject();
  public fxCalculo = '100%'

  //CHART
  public lineChartData: ChartDataSets[] = []
  public lineChartLabels: Label[] = []
  
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    annotation: {
      annotations: [],
    },
  };

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(0,128,0,0)',
      borderColor: 'green',
      pointBackgroundColor: 'rgba(0,128,0,1)',
      pointBorderColor: 'green',
      pointHoverBackgroundColor: '#008000',
      pointHoverBorderColor: 'rgba(0,128,0,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(0,0,255,0)',
      borderColor: 'blue',
      pointBackgroundColor: 'rgba(0,0,255,1)',
      pointBorderColor: 'blue',
      pointHoverBackgroundColor: '#0000FF',
      pointHoverBorderColor: 'rgba(0,0,255,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(255,0,0,1)',
      pointBorderColor: 'red',
      pointHoverBackgroundColor: '#FF0000',
      pointHoverBorderColor: 'rgba(255,0,0,0.8)'
    },
    { // red
      backgroundColor: 'rgba(128,0,128,0)',
      borderColor: 'purple',
      pointBackgroundColor: 'rgba(128,0,128,1)',
      pointBorderColor: 'purple',
      pointHoverBackgroundColor: '#A020F0',
      pointHoverBorderColor: 'rgba(128,0,128,0)'
    },
    { // red
      backgroundColor: 'rgba(255,255,0,0)',
      borderColor: 'yellow',
      pointBackgroundColor: 'rgba(255,255,0,1)',
      pointBorderColor: 'yellow',
      pointHoverBackgroundColor: '#FFFF00',
      pointHoverBorderColor: 'rgba(255,255,0,0.8)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0)',
      borderColor: 'black',
      pointBackgroundColor: 'rgba(0,0,0,1)',
      pointBorderColor: 'black',
      pointHoverBackgroundColor: '#000000',
      pointHoverBorderColor: 'rgba(0,0,0,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

private _selectedTheme: Theme = 'light-theme';
public get selectedTheme() {
  return this._selectedTheme;
}
public set selectedTheme(value) {
  this._selectedTheme = value;
  let overrides: ChartOptions;
  if (this.selectedTheme === 'dark-theme') {
    overrides = {
      legend: {
        labels: { fontColor: 'white' }
      },
      scales: {
        xAxes: [{
          ticks: { fontColor: 'white' },
          gridLines: { color: 'rgba(255,255,255,0.1)' }
        }],
        yAxes: [{
          ticks: { fontColor: 'white' },
          gridLines: { color: 'rgba(255,255,255,0.1)' }
        }]
      }
    };
  } else {
    overrides = {};
  }
  this.themeService.setColorschemesOptions(overrides);
}

setCurrentTheme(theme: Theme) {
  this.selectedTheme = theme;
}

 
  constructor(@Inject(MAT_DIALOG_DATA) public data: Mge,
              public dialogRef: MatDialogRef<MgeDialogComponent>,
              private router: Router,
              private formBuilder: FormBuilder,
              private mgeService: MgeService,
              public dialog: MatDialog,
              private themeService: ThemeService) {
                this.usuario  = sessionStorage.getItem('usuario')
                ? JSON.parse(sessionStorage.getItem('usuario'))
                : null;

                this.mge = data;
                this.carregaMedicoes(this.mge.OSE.loc)
              }


  public qtdCMBCorrente = 1;
  public qtdCMBHorimetro = 1;
              
  
  async carregaMedicoes(loc){
    this.carregando = true

    var m = await this.mgeService.getmgesViewTratada(loc).then(r => {return r})
    console.log('cable', m)
    //this.medicoes = [[],[],[],[],[],[],[]];
    if(m){
      if(m.correntes){
        this.correntes = m.correntes
        this.horimetros = m.horimetros
        this.lineChartLabels = m.datasCorrente
        this.horimetrosData = m.datasHorimetro

        for (let index = 0; index < m.qtdCMBCorrente; index++) {
          this.lineChartData.push({data: this.correntes[index], label: "CMB-"+(index+1)})
        }
        console.log(this.lineChartData)
       // this.calculaHOperacao(m.horimetros)
      }
    }
    this.carregando = false;
  }

  calculaHOperacao(h){
    let hOperac = h
    for (let indexCmb = 0; indexCmb < hOperac.length; indexCmb++) {
      for (let indexPeriodo = 0; indexPeriodo < hOperac[indexCmb].length; indexPeriodo++) {
        if(indexPeriodo== 0){
          hOperac[indexCmb][indexPeriodo] = 0
        } else {
          hOperac[indexCmb][indexPeriodo] = hOperac[indexCmb][indexPeriodo] - hOperac[indexCmb][indexPeriodo-1]
        }            
      }

      console.log(hOperac)
    }

    console.log('operacao', this.horasOperacao,this.horimetros)
  }

  
  async alertaDialog(data: any){
    // data: {
    //   descricao: descricao,
    //   opcao1: 'Excluir',
    // }
    const dialogRefAlert = this.dialog.open(AlertDialogComponent, {
      data
    });
    return await dialogRefAlert.afterClosed().toPromise();
  }

  // escolhendo(servico: {cod: string, titulo: string}) {
  //    this.dialogRef.close(servico);
  // }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

}
