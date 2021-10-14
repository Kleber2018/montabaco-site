import { Component, Inject, ViewChild, Renderer2, ElementRef, OnDestroy, Input } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';


@Component({
  selector: 'app-cropper-dialog',
  templateUrl: './cropper-dialog.component.html',
  styleUrls: ['./cropper-dialog.component.css']
})
export class CropperDialogComponent {


  @Input() name: string;
  cropperSettings: CropperSettings;  
  imageCropData:any;
  @ViewChild('cropper')
  cropper:ImageCropperComponent;
  
  public imagem: any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CropperDialogComponent>) {
    this.cropperSettings = new CropperSettings();
    if(data.imagem.target.files[0].size > 6000000){
      this.cropperSettings.compressRatio = 0.3;
    } else if(data.imagem.target.files[0].size > 4000000){
      this.cropperSettings.compressRatio = 0.4;
    } else if(data.imagem.target.files[0].size > 3000000){
      this.cropperSettings.compressRatio = 0.7;
    } else if(data.imagem.target.files[0].size > 2000000){
      this.cropperSettings.compressRatio = 0.8;
    } else if(data.imagem.target.files[0].size > 1000000){
      this.cropperSettings.compressRatio = 0.9;
    }

    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 300;
    this.cropperSettings.height = 300;
    this.cropperSettings.preserveSize = true;
    // this.cropperSettings.croppedWidth = 300; //tamanho da imagem depois de recortada
    // this.cropperSettings.croppedHeight = 300; //tamanho da imagem depois de recortada
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.keepAspect = false;
    this.cropperSettings.fileType = 'image/jpeg'
    this.imageCropData = {};


    this.fileChangeListener(data.imagem);
    
  }

  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
}

getImageData(){
  fetch(this.imageCropData.image)
    .then(res => res.blob())
    .then(blob => {
        var dataLocal = new Date();
        var nomeImagem = dataLocal.getTime().toString();
        const imageFile = new File([blob], nomeImagem, { type: 'image/jpeg' });
        this.dialogRef.close(imageFile)
     })
}  





}
