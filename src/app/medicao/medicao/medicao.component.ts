import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAction, AngularFireDatabase } from '@angular/fire/compat/database';


import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Color, ThemeService } from 'ng2-charts';
import { ChartDataSets, ChartOptions, Chart  } from 'chart.js';
import { Label } from 'ng2-charts/lib/base-chart.directive';
type Theme = 'light-theme' | 'dark-theme';
@Component({
  selector: 'app-medicao',
  templateUrl: './medicao.component.html',
  styleUrls: ['./medicao.component.css']
})
export class MedicaoComponent implements OnInit {
  item
  lineChart: any;
  public temperaturas: any =  []

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
    { // red
      backgroundColor: 'rgba(255,0,0,0)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(255,0,0,1)',
      pointBorderColor: 'red',
      pointHoverBackgroundColor: '#FF0000',
      pointHoverBorderColor: 'rgba(255,0,0,0.8)'
    },

    { // dark grey
      backgroundColor: 'rgba(0,0,255,0)',
      borderColor: 'blue',
      pointBackgroundColor: 'rgba(0,0,255,1)',
      pointBorderColor: 'blue',
      pointHoverBackgroundColor: '#0000FF',
      pointHoverBorderColor: 'rgba(0,0,255,1)'
    },
    { // grey
      backgroundColor: 'rgba(0,128,0,0)',
      borderColor: 'green',
      pointBackgroundColor: 'rgba(0,128,0,1)',
      pointBorderColor: 'green',
      pointHoverBackgroundColor: '#008000',
      pointHoverBorderColor: 'rgba(0,128,0,0.8)'
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







  public medicao;
  constructor(public db: AngularFireDatabase, private themeService: ThemeService
    ) { 
    this.inicializando()
    
    //db.child("numero_serie").child("medicao").set(data, user['idToken']) #edita o mesmo arquivo

   
  }

  ngOnInit(): void {

  }

 
  async inicializando(){
    const ref = this.db.object('0000000016223e72/medicao').valueChanges();
    const ref2 = this.db.list('0000000016223e72/medicoes', ref =>   ref.limitToLast(20) ).valueChanges()

    ref2.subscribe(items => {
        var umidades = []
        var datas = []
        console.log('antes', this.lineChartData)
        items.forEach(item => { 
          var dadosGrafico = [['Data', 'Umidade', 'Temperatura']]
          //dadosGrafico.push([new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes(),item['umidade'], item['temperatura']])
          //this.lineChartLabels.push(new Date(item['updated']).getDay()+ " - " + new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes())
          this.lineChartLabels.push(item['updated'])
          umidades.push(item['umidade'])
          var t = (item['temperatura'] - 32) / 1.8
          this.temperaturas.push(parseFloat(t.toFixed(1)))
          //console.log('dddd', parseFloat(t.toFixed(1)), item['temperatura'])
          //this.lineChartData.push({data: item['temperatura'], label:"Temperatura"}, {data: item['umidade'], label:"Umidade"})
          //datas.push(new Date(item['updated']).getDay()+ " - " + new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes())
        })
        console.log('teste22', this.lineChartData)
        this.lineChartData.push({data: this.temperaturas, label:"Temperatura"}, {data: umidades, label:"Umidade"})
        console.log('teste222', this.lineChartData)

        //this.lineChartMethod(temperaturas, umidades, datas)
      }

    );
    
    //;

    ref.subscribe(med => {
      if(med){}
        this.medicao = med
        try {
          var spl = med['updated'].split(' ')
          var spl1 = spl[0].split('-')
          var spl2 = spl[1].split(':')
          this.medicao.updated = `${spl1[2]}/${spl1[1]} - ${spl2[0]}:${spl2[1]}`
        } catch (error) {
          this.medicao.updated = 'erro'
        }
        let temp1 = (med['temperatura'] - 32) / 1.8
        this.medicao.temperatura = parseFloat(temp1.toFixed(1))
      }
      )
  }
}
