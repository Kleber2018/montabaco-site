import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAction, AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/compat/database';

import { Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { Color, ThemeService } from 'ng2-charts';
import { ChartDataSets, ChartOptions, Chart  } from 'chart.js';
import { Label } from 'ng2-charts/lib/base-chart.directive';
import { MedicaoService } from '../medicao.service';
import { Log } from 'src/app/shared/model/log.model';
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

  public medidores //= ['000000003862b5f0', '000000005ff1c9d4', '0000000093348e20']

  public medicao = {temperatura: 0, umidade: 0, updated: "sem medição"};
  public logs: Log[] = [];
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
    this.medidores = await this.medicaoService.getMedidores().then(async res => {
      this.medidores = await res.docs.map((e, index) => {
        console.log('chegou', e)
        //console.log(e.payload.val())
        return {id : e.data().id,
                order : index+1 }
      });
      console.log('chegou medidores', this.medidores )
      this.medidores.sort((a, b)=> {
        return +a.order - +b.order
      });
      return  this.medidores 
    });
    if(this.medidores){
      this.getMedicoesSubscribe(this.medidores[0].id)
    }
  }

  getMedicaoSubscribe(id: string){
    this.medicaoService.getMedicao(id).then(med => {
      var primeiraMedicao = true;
      med.docs.map(e => { 
        if(primeiraMedicao){
          this.medicao.updated = new Date(e.data().createdAt * 1000).getDate()+"/"+new Date(e.data().createdAt * 1000).getMonth()+ " - " + new Date(e.data().createdAt * 1000).getHours() + ":"+ new Date(e.data().createdAt * 1000).getMinutes()
          primeiraMedicao = false;
          this.medicao.temperatura = e.data().temp
          this.medicao.umidade = e.data().umid
        }
      })
      // if(med){
      //   this.medicao
      //   try {
      //     var spl = med['createdAt'].split(' ')
      //     var spl1 = spl[0].split('-')
      //     var spl2 = spl[1].split(':')
      //     this.medicao.updated = `${spl1[2]}/${spl1[1]} - ${spl2[0]}:${spl2[1]}`
      //   } catch (error) {
      //     this.medicao.updated = 'erro'
      //   }
      //   let temp1 = (med['temperatura'] - 32) / 1.8
      //   this.medicao.temperatura = parseFloat(temp1.toFixed(1))
      // }
    })
  }

  getLogsSubscribe(id: string){
    this.logs = [];
    // msg_MQTT_set = id + "#" +cod_secure + "#L#SET#"+ String(set_temp) + "#"+ String(set_umid) + "#" + String(status_ventoinha_rele) + "#" + String(t.mday) + "/" + String(t.mon) + "/"  + String(t.year-2000) +"#"+ String(t.hour) + ":" + String(t.min) +"#"+ String(numero_etapa)+"#";     
    this.medicaoService.getLogs(id).then(lgs => {
      lgs.docs.map(lg => {
        console.log(lg.data())
        this.logs.push(lg.data());
      })
    })

  }

  getMedicoesSubscribe(id: string){
    this.getMedicaoSubscribe(id)
    this.getLogsSubscribe(id)
    this.medicaoService.getMedicoes(id).then(medicoes => {
      var umidades = []
      var umidades2 = []
      var temps = []
      var temps2 = []
      this.lineChartData = []
      this.lineChartLabels = []
      //var primeiraMedicao = true;
      //var datas = []
      this.temperaturas = []
      medicoes.docs.map(e => { 
        // if(primeiraMedicao){
        //   this.medicao.updated = new Date(e.data().createdAt * 1000).getDate()+"/"+new Date(e.data().createdAt * 1000).getMonth()+ " - " + new Date(e.data().createdAt * 1000).getHours() + ":"+ new Date(e.data().createdAt * 1000).getMinutes()
        //   primeiraMedicao = false;
        //   this.medicao.temperatura = e.data().temp
        //   this.medicao.umidade = e.data().umid
        // }
       // console.log(e.data())
        var dadosGrafico = [['Data', 'Umidade', 'Temperatura', 'Temperatura2']]
        //dadosGrafico.push([new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes(),item['umidade'], item['temperatura']])
        //this.lineChartLabels.push(new Date(item['updated']).getDay()+ " - " + new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes())
        // var spl = e.data().createdAt.split(' ')
        // var spl1 = spl[0].split('-')
        // var spl2 = spl[1].split(':')
        this.lineChartLabels.unshift(new Date(e.data().createdAt * 1000).getDate()+ " - " + new Date(e.data().createdAt * 1000).getHours() + ":"+ new Date(e.data().createdAt * 1000).getMinutes())
        //this.lineChartLabels.push(`${spl1[2]}/${spl1[1]} - ${spl2[0]}:${spl2[1]}`)
        umidades.unshift(e.data().umid)
        umidades2.unshift(e.data().umid2)
        var t = e.data().temp // (e.data().temp - 32) / 1.8
        var t2 = e.data().temp2 // (e.data().temp2 - 32) / 1.8
        temps.unshift(parseFloat(t.toFixed(1)))
        temps2.unshift(parseFloat(t2.toFixed(1)))
        this.temperaturas.unshift(parseFloat(t.toFixed(1)))
        //console.log('dddd', parseFloat(t.toFixed(1)), item['temperatura'])
        //this.lineChartData.push({data: item['temperatura'], label:"Temperatura"}, {data: item['umidade'], label:"Umidade"})
        //datas.push(new Date(item['updated']).getDay()+ " - " + new Date(item['updated']).getHours() + ":"+ new Date(item['updated']).getMinutes())
      })
      
      this.lineChartData.push({data: temps, label:"Temperatura (ºC)"}, {data: temps2, label:"Temperatura2 (ºC)"}, {data: umidades, label:"Umidade (%)"}, {data: umidades2, label:"Umidade2 (%)"})
      //this.lineChartMethod(temperaturas, umidades, datas)
    }
  )

  }


  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
