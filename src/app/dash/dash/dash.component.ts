import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SidenavItem } from 'src/app/shared/model/sidenav-item.model';
import { Usuario } from 'src/app/usuario/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SidenavItemFactory } from 'src/app/shared/factory/sidenav-item.factory';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {


  private end: Subject<boolean> = new Subject();

  public sidenavItems: SidenavItem[] = [];

  public usuario: Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
      this.sidenavItems = SidenavItemFactory.buildSidenav();
  }

}
