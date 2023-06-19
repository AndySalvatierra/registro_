import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-objetivo-estrategico-institucional',
  templateUrl: './objetivo-estrategico-institucional.component.html',
  styleUrls: ['./objetivo-estrategico-institucional.component.scss']
})
export class ObjetivoEstrategicoInstitucionalComponent implements OnInit {

  configuracion_anios: any = [];
  tab: number = 0;
  catalogo_programas: any = [];
  catalogo_responsables: any = [];
  catalogo_objetivos: any = [];
  catalogo_politicas: any = [];
  objetivos_estrategicos: any = [];
  anios: any = [];

  objetivo_estrategico: any = {
    idobjetivo_estrategico: -1,
    idobjetivo_estrategico_padre: -1,
    numero: null,
    descripcion: "",
    idtipo_programa: -1,
    idtipo_responsable_estrategico: -1,
    idescuela: -1,
    idescuela_anterior: -1,
    iddepartamento_anterior: -1,
    iddepartamento_auxiliar: -1,
    activo: true,
    anio_inicio: null,
    anio_fin: null,
    json_objetivos: [],
    json_politicas: [],
    tipo: "INSTITUCIONAL",
    anios: [],
    idpersonal: -1
  };

  constructor(
    private api: ApiService,
    private eventos: EventosService
  ) { }

  ngOnInit() {
    // carrera - vicedecano de carrera
    this.obtener_configuracion_anios();
  }

  obtener_configuracion_anios() {
    this.eventos.loading(true);
    this.api.obtener_configuracion({ codigo: "SIPI --> AÑOS PEDI" }).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.validar_token(resp[0].p_sesion);
      this.configuracion_anios = resp[0].p_datos_configuracion;
      for(let i = 0; i < this.configuracion_anios.length; i++) {
        this.anios.push(this.configuracion_anios[i].anio);        
      }
      this.obtener_objetivos_estrategicos("INSTITUCIONAL");
    }, (err) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  obtener_objetivos_estrategicos(tipo: any) {
    console.log(this.anios)
    this.eventos.loading(true);
    this.api.obtener_objetivos_estrategicos({
      tipo: tipo,
      idescuela: -1,
      idindice_departamento: -1,
      anios: this.anios
    }).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.validar_token(resp[0].p_sesion);
      this.objetivos_estrategicos = resp[0].p_objetivos_estrategicos;
      this.obtener_catalogo_programas();
    }, (err) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  obtener_catalogo_programas() {
    this.eventos.loading(true);
    this.api.obtener_catalogo({ catalogo: "SIPI --> PROGRAMAS" }).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.validar_token(resp[0].p_sesion);
      this.catalogo_programas = resp[0].p_catalogo;
      this.obtener_catalogo_responsables_estrategicos();
    }, (err: any) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  obtener_catalogo_responsables_estrategicos() {
    this.eventos.loading(true);
    this.api.obtener_catalogo({ catalogo: "SIPI --> RESPONSABLES ESTRATEGICOS" }).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.validar_token(resp[0].p_sesion);
      this.catalogo_responsables = resp[0].p_catalogo;
      this.obtener_catalogo_objetivos();
    }, (err: any) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  obtener_catalogo_objetivos() {
    this.eventos.loading(true);
    this.api.obtener_catalogo({ catalogo: "SIPI --> OBJETIVOS PCO" }).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.validar_token(resp[0].p_sesion);
      this.catalogo_objetivos = resp[0].p_catalogo;
      this.obtener_catalogo_politicas();
    }, (err: any) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  obtener_catalogo_politicas() {
    this.eventos.loading(true);
    this.api.obtener_catalogo({ catalogo: "SIPI --> POLITICAS NACIONALES" }).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.validar_token(resp[0].p_sesion);
      this.catalogo_politicas = resp[0].p_catalogo;
    }, (err: any) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  guardar_objetivo_estrategico() {
    this.objetivo_estrategico.anio_fin = this.objetivo_estrategico.anio_inicio;
    this.objetivo_estrategico.anios = this.anios;
    this.objetivo_estrategico.idpersonal = this.eventos.usuario.p_idpersonal;
    this.eventos.loading(true);
    this.api.guardar_objetivo_estrategico(this.objetivo_estrategico).subscribe((resp) => {
      this.eventos.loading(false);
      this.eventos.validar_token(resp[0].p_sesion);
      if (resp[0].p_status == 'True') {
        this.eventos.mensaje('success', resp[0].p_message);
        this.limpiar_datos();
        this.objetivos_estrategicos = resp[0].p_objetivos_estrategicos;
      } else {
        this.eventos.mensaje('error', resp[0].p_message);
      }
    }, (err: any) => {
      this.eventos.loading(false);
      this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
    });
  }

  cargar_datos_actualizar(item: any) {
    this.objetivo_estrategico = item;
    this.objetivo_estrategico.anio_inicio = this.objetivo_estrategico.anio_inicio.toString();
    this.objetivo_estrategico.idtipo_programa = this.objetivo_estrategico.idtipo_programa.toString();
    this.objetivo_estrategico.idtipo_responsable_estrategico = this.objetivo_estrategico.idtipo_responsable_estrategico.toString();
    this.objetivo_estrategico.idindice_departamento = this.objetivo_estrategico.iddepartamento_auxiliar;
    this.catalogo_objetivos = this.objetivo_estrategico.json_objetivos;
    this.catalogo_politicas = this.objetivo_estrategico.json_politicas;
    this.tab = 0;
  }

  limpiar_datos() {
    this.objetivo_estrategico = {
      idobjetivo_estrategico: -1,
      idobjetivo_estrategico_padre: -1,
      numero: null,
      descripcion: "",
      idtipo_programa: -1,
      idtipo_responsable_estrategico: -1,
      idescuela: -1,
      idescuela_anterior: -1,
      iddepartamento_anterior: -1,
      iddepartamento_auxiliar: -1,
      activo: true,
      anio_inicio: null,
      anio_fin: null,
      json_objetivos: [],
      json_politicas: [],
      tipo: "INSTITUCIONAL",
      anios: [],
      idpersonal: -1
    };
  }

}
