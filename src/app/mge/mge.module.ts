import { NgModule, LOCALE_ID} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

/* Routes. */
import { MgeRoutingModule } from './mge-routing.module';

/* Third party modules. */
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

/* Modules. */
import { SharedModule } from '../shared/shared.module';

/* Components.*/
import { MgeListComponent } from './mge-list/mge-list.component';
import { MgeFormComponent } from './mge-form/mge-form.component';
import { MgeDashboardComponent } from './mge-dashboard/mge-dashboard.component';
import {MedicoesDialogComponent} from './dialog/medicoes-dialog/medicoes-dialog.component';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NgxMaskModule } from 'ngx-mask';

import {NgxImageCompressService} from 'ngx-image-compress';
import { MgeDialogComponent } from './dialog/mge-dialog/mge-dialog.component';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MgeRoutingModule,
    SharedModule,
    MaterialFileInputModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    NgxMaskModule,
    ChartsModule
  ],
  declarations: [
    MgeListComponent,
    MgeFormComponent,
    MgeDashboardComponent,
    MedicoesDialogComponent,
    MgeDialogComponent
  ],
 exports: [
   MgeListComponent,
   MatProgressBarModule
 ],
 providers: [NgxImageCompressService]
})
export class MgeModule { }
