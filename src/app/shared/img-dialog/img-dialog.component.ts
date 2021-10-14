import { Component, Inject, ViewChild, Renderer2, ElementRef, OnDestroy, Input } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

import { MovimentacaoService } from 'src/app/movimentacao/movimentacao.service';


@Component({
  selector: 'app-img-dialog',
  templateUrl: './img-dialog.component.html',
  styleUrls: ['./img-dialog.component.css']
})
export class ImgDialogComponent {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: {url: string},
        public dialogRef: MatDialogRef<ImgDialogComponent>,
        private movimentacaoService: MovimentacaoService,
        public dialog: MatDialog) {
  }

  async removerReferenciaImg(){
    this.dialogRef.close('excluir');
  }

}
