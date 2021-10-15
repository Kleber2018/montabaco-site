import { NgModule, Injectable, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { registerLocaleData } from '@angular/common';

// import localeBr from '@angular/common/locales/pt';

/* Routes.*/
import { AppRoutingModule } from './app-routing.module';

/* Environment.*/
import { environment } from '../environments/environment';

/* Third party modules.*/
import { NgxMaskModule, IConfig } from 'ngx-mask';
//import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
//import { AngularFireModule } from '@angular/fire';
//import { AngularFirestoreModule } from '@angular/fire/firestore';
//import { AngularFireStorageModule } from '@angular/fire/storage';

/* Modules.*/
import { SharedModule } from './shared/shared.module';

/* Components.*/
import { AppComponent } from './app/app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { NgxOneSignalModule } from 'ngx-onesignal';
//import { AngularFireDatabaseModule } from '@angular/fire/database';
import * as Sentry from '@sentry/browser';
//import { AngularFireAnalyticsModule, ScreenTrackingService } from '@angular/fire/analytics';
import { DeviceDetectorModule } from 'ngx-device-detector';

// import { registerLocaleData } from '@angular/common';
// import { NgxOneSignalModule } from 'ngx-onesignal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
//import { AngularFireFunctionsModule } from '@angular/fire/functions';
import {registerLocaleData} from '@angular/common';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

/* Configurations.*/
export const options: Partial<IConfig> | (() => Partial<IConfig>) = { };

import localePt from '@angular/common/locales/pt';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { ChartsModule } from 'ng2-charts';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';

registerLocaleData(localePt, 'pt-BR');

// registerLocaleData(localeBr, 'pt');

Sentry.init({
  dsn: ''
  //dsn: 'https://f37ded31b8f34a239f6c100189a24d42@o362766.ingest.sentry.io/5378811'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    console.log('teste', error);
    const eventId = Sentry.captureException(error.originalError || error);
   // Sentry.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // NgxOneSignalModule.forRoot({
    //   appId: "0572ae3a-7580-40ca-9310-ec4e99326fd3", //delivery dashboard
    //   allowLocalhostAsSecureOrigin: true,
    //   autoRegister: false,
    //   notifyButton: {
    //     enabled: true,
    //   }
    // }),
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp( environment.firebase )),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    //AngularFirestoreModule,
    //AngularFireAnalyticsModule,
    AngularFireDatabaseModule,
    //AngularFireFunctionsModule,
    //AngularFireAuthModule,
    //AngularFireStorageModule,
   // NgxMaterialTimepickerModule,
    NgxMaskModule.forRoot(options),
    SharedModule,
    // ServiceWorkerModule.register('OneSignalSDKWorker.js', {
    //   enabled: environment.production,
    // }),
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    DeviceDetectorModule.forRoot(),
    NgxMaterialTimepickerModule
  ],
  providers: [
    //AngularFireAuth,
    //ScreenTrackingService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    //{ provide: ErrorHandler, useValue: SentryErrorHandler }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
