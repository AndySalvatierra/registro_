import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

  isCollapsed = false;

  constructor(
    public eventos: EventosService,
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let datos_generales_login = sessionStorage.getItem(this.eventos._DATOS_GENERALES_LOGIN)
    let menu_defecto: any = sessionStorage.getItem(this.eventos._MENU_DEFECTO);    
    if (datos_generales_login) {
      this.eventos.usuario = menu_defecto ? JSON.parse(menu_defecto) : JSON.parse(datos_generales_login);
      this.get_modulos(this.eventos.usuario.p_aplicacion_defecto);
      this.get_roles(this.eventos.usuario.p_aplicacion_defecto, this.eventos.usuario.p_modulo_defecto);
      this.mostrar_menu(this.eventos.usuario.p_aplicacion_defecto, this.eventos.usuario.p_modulo_defecto, this.eventos.usuario.p_rol_defecto);
    } else {
      this.eventos.cerrar_sesion();
    }
  }

  cambiar_aplicacion(item: any) {
    this.eventos.usuario.p_modulo = [];
    this.eventos.usuario.p_roles = [];
    this.eventos.usuario.p_menu_defecto = [];
    this.eventos.usuario.p_aplicacion_defecto = item.id_aplicacion;
    this.eventos.usuario.p_aplicacion_defecto_descripcion = item.descripcion;
    this.eventos.usuario.p_modulo_defecto_descripcion = "";
    this.eventos.usuario.p_rol_defecto_descripcion = "";
    this.router.navigate(["/dashboard"]);
    sessionStorage.setItem(this.eventos._MENU_DEFECTO, JSON.stringify(this.eventos.usuario));
    this.get_modulos(item.id_aplicacion);
  }

  cambiar_modulo(item: any) {
    this.eventos.usuario.p_roles = [];
    this.eventos.usuario.p_menu_defecto = [];
    this.eventos.usuario.p_modulo_defecto = item.id_modulo;
    this.eventos.usuario.p_modulo_defecto_descripcion = item.descripcion;
    this.eventos.usuario.p_rol_defecto_descripcion = "";
    this.router.navigate(["/dashboard"]);
    sessionStorage.setItem(this.eventos._MENU_DEFECTO, JSON.stringify(this.eventos.usuario));
    this.get_roles(this.eventos.usuario.p_aplicacion_defecto, item.id_modulo);
  }

  cambiar_rol(item: any) {
    this.eventos.usuario.p_menu_defecto = [];
    this.eventos.usuario.p_rol_defecto = item.id_rol;
    this.eventos.usuario.p_rol_defecto_descripcion = item.descripcion;
    this.router.navigate(["/dashboard"]);
    sessionStorage.setItem(this.eventos._MENU_DEFECTO, JSON.stringify(this.eventos.usuario));
    this.mostrar_menu(this.eventos.usuario.p_aplicacion_defecto, this.eventos.usuario.p_modulo_defecto, item.id_rol);
  }

  get_modulos(idaplicacion: any) {
    this.eventos.loading(true);
    this.api.get_modulos({
      id_aplicacion: idaplicacion,
      idpersonal: this.eventos.usuario.p_idpersonal
    }).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.usuario.p_modulo = resp[0].modulos;      
    }, (err) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  get_roles(idaplicacion: any, idmodulo: any) {
    this.eventos.loading(true);
    this.api.get_roles({
      id_aplicacion: idaplicacion,
      id_modulo: idmodulo,
      idpersonal: this.eventos.usuario.p_idpersonal
    }).subscribe((resp) => {
      this.eventos.loading(false);     
      this.eventos.usuario.p_roles = resp[0].roles;
    }, (err) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  mostrar_menu(idaplicacion: any, idmodulo: any, idrol: any) {
    this.eventos.loading(true);
    this.api.mostrar_menu({
      idapp: idaplicacion,
      idmod: idmodulo,
      idrol: idrol
    }).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.usuario.p_menu_defecto = resp[0].p_menu;
    }, (err) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

}
