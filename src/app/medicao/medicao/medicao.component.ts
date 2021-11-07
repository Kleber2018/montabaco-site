import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAction, AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/compat/database';

import { Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { Color, ThemeService } from 'ng2-charts';
import { ChartDataSets, ChartOptions, Chart  } from 'chart.js';
import { Label } from 'ng2-charts/lib/base-chart.directive';
import { MedicaoService } from '../medicao.service';
type Theme = 'light-theme' | 'dark-theme';
@Component({
  selector: 'app-medicao',
  templateUrl: './medicao.component.html',
  styleUrls: ['./medicao.component.css']
})
export class MedicaoComponent implements OnInit {
  private end: Subject<boolean> = new Subject();
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

    { // orange
      backgroundColor: 'rgba(255,140,0,0)',
      borderColor: 'orange',
      pointBackgroundColor: 'rgba(255,140,0,1)',
      pointBorderColor: 'orange',
      pointHoverBackgroundColor: '#0000FF',
      pointHoverBorderColor: 'rgba(255,140,0,1)'
    },
    { // blue
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

  public medidores = []
  public medicao;
  constructor(
    public db: AngularFireDatabase, 
    private themeService: ThemeService,
    private medicaoService: MedicaoService
    ) {     
      this.getMedidoresPromise()
  }

  ngOnInit(): void {
  }



  async getMedidoresPromise(){
    this.medidores = await this.medicaoService.getMedidores().pipe(first()).toPromise().then(res => {
      this.medidores = res.map(e => {
        //console.log(e.payload.val())
        return e.key
      });
      return  this.medidores 
    });
    if(this.medidores){
      this.getMedicoesSubscribe(this.medidores[1])
    }
  }

  getMedicaoSubscribe(id: string){
    this.medicaoService.getMedicao(id).pipe().subscribe(med => {
      if(med){
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
    })
  }

  getMedicoesSubscribe(id: string){
    this.getMedicaoSubscribe(id)
    this.medicaoService.getMedicoes(id).pipe().subscribe(items => {
      var umidades = []
      var temps = []
      var temps2 = []
      this.lineChartData = []
      this.lineChartLabels = []
      //var datas = []
      this.temperaturas = []
      items.forEach(item => { 
        var dadosGrafico = [['Data', 'Umidade', 'Temperatura', 'Temperatura2']]
        //dadosGrafico.push([new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes(),item['umidade'], item['temperatura']])
        //this.lineChartLabels.push(new Date(item['updated']).getDay()+ " - " + new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes())
        var spl = item['updated'].split(' ')
        var spl1 = spl[0].split('-')
        var spl2 = spl[1].split(':')
        this.lineChartLabels.push(`${spl1[2]}/${spl1[1]} - ${spl2[0]}:${spl2[1]}`)
        umidades.push(item['umidade'])
        var t = (item['temperatura'] - 32) / 1.8
        var t2 = (item['temperatura2'] - 32) / 1.8
        temps.push(parseFloat(t.toFixed(1)))
        temps2.push(parseFloat(t2.toFixed(1)))
        this.temperaturas.push(parseFloat(t.toFixed(1)))
        //console.log('dddd', parseFloat(t.toFixed(1)), item['temperatura'])
        //this.lineChartData.push({data: item['temperatura'], label:"Temperatura"}, {data: item['umidade'], label:"Umidade"})
        //datas.push(new Date(item['updated']).getDay()+ " - " + new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes())
      })
      this.lineChartData.push({data: temps, label:"Temperatura (ºC)"}, {data: temps2, label:"Temperatura2 (ºC)"}, {data: umidades, label:"Umidade (%)"})
      //this.lineChartMethod(temperaturas, umidades, datas)
    }
  )

  }


  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
