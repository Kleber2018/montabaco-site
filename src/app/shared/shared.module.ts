import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**Angular Material.*/
import { AngularMaterialModule } from './angular-material/angular-material.module';

/**Third party modules.*/
import { FlexLayoutModule } from '@angular/flex-layout';

/**Modules.*/
import { ButtonModule } from './button/button.module';

/**Components.*/
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';

import { ImageCropperModule } from 'ngx-img-cropper';
import { NgxMaskModule } from 'ngx-mask';





@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    AlertDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    FlexLayoutModule,
    ButtonModule,
    ImageCropperModule
  ],
  exports: [
    AngularMaterialModule,
    FlexLayoutModule,
    ButtonModule,
    FooterComponent,
    HeaderComponent,
    LayoutComponent
  ]
})
export class SharedModule { }
