import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { EventosService } from 'src/app/services/eventos.service';



@Component({
    selector: 'app-login',
    templateUrl: './prueba.component.html',
    styleUrls: ['./prueba.component.css']
  })
  export class pruebaComponent implements OnInit {

    nombre: string = ""; 
    
    objeto_persona: any = {
        cedula: "", 
        nombre: "",
        apellidos: "",
        telefono: "",
        ciudad: "",
        correo: "",
        fecha_nacimiento: new Date(),//moment(moment().format("DD/MM/YYYY")).toDate(),
    }; 

    eliminar(item: any){
      this.objeto_tabla.splice(item, 1);
  };

    objeto_tabla: any = [

    ];
    
    objeto_ciudad: any =[
      'Portoviejo',
  'Rocafuerte',
  'Santa Ana',
  'Manta',
  'Chone',
  'Quito',
  'Guayaquil',
  'Cuenca',
  'Ambato',
  'Machala',
  'Loja',
  'Esmeraldas',
  'Ibarra',
  'Quevedo',
  'Riobamba',
  'Santo Domingo',
  'Milagro',
  'Durán',
  'Machachi',
  'Sangolquí'
    ];
    
   limpiar_datos(){
    this.objeto_persona={
      cedula: "",
      nombre: "",
      apellidos: "",
      telefono: "",
      ciudad: "",
      correo: "",
      fecha_nacimiento: new Date(),//moment(moment().format("DD/MM/YYYY")).toDate(),
    };
   }

    usuarioForm!: FormGroup;
    modalVisible = false;
  
    datos_cambiar_clave: any = {
      usuario: '',
      clave_anterior: '',
      clave_nueva: '',
      clave_confirmacion: ''
    };
  
    constructor(
      private fb: FormBuilder,
      public eventos: EventosService,
      private api: ApiService,
      private router: Router
    ) { }
    
    ngOnInit(): void {
      this.usuarioForm = this.fb.group({
        usuario: [null, [Validators.required]],
        password: [null, [Validators.required]],
        remember: [true]
      });
      console.log(this.objeto_persona);
    }
  
    onChange(result: Date): void{
        console.log(this.objeto_persona)
    }

    dar_click(){
      console.log(this.objeto_persona);
      this.objeto_tabla.push(this.objeto_persona);
      console.log(this.objeto_tabla)
      this.limpiar_datos();
    }

    autenticar(): void {
      if (this.usuarioForm.valid) {
        this.eventos.loading(true);
        this.api.autenticar(this.usuarioForm.value).subscribe((resp) => {
          if (resp[0].p_status == 0) {
            this.eventos.loading(false);
            this.eventos.usuario = resp[0];
            this.api.token = resp[0].p_token;
            localStorage.setItem(this.eventos._AUTH_TOKEN, resp[0].p_token);
            sessionStorage.setItem(this.eventos._DATOS_GENERALES_LOGIN, JSON.stringify(this.eventos.usuario));
            sessionStorage.setItem(this.eventos._DATOS_GENERALES_LOGIN, JSON.stringify(this.eventos.usuario));
  
            this.router.navigate(["dashboard"]);
          } else if (resp[0].p_status == 1) {
            this.eventos.loading(false);
            this.eventos.mensaje('info', 'Por favor cambie su contraseña...');
            setTimeout(() => {
              this.modalVisible = true;
              console.log("modal cambiar contraseña");
            }, 1000);
          } else {
            if (resp[0].p_error == "no") {
              this.eventos.mensaje('warning', 'Usuario o contraseña incorrectos...');
              this.eventos.loading(false);
            } else {
              this.eventos.mensaje('error', resp[0].p_error);
              this.eventos.loading(false);
            }
          }
        }, (err) => {
          this.eventos.loading(false);
          this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
        });
      } else {
        Object.values(this.usuarioForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
  
    cambiar_clave(): void {
      this.datos_cambiar_clave.usuario = this.usuarioForm.value.usuario.replace('@utm.edu.ec', '');
      this.datos_cambiar_clave.clave_anterior = this.usuarioForm.value.password;
      this.eventos.loading(true);    
      this.api.cambiar_clave(this.datos_cambiar_clave).subscribe((resp) => {
        this.eventos.loading(false);
        if(resp[0].p_status == 'True') {
          this.eventos.mensaje('success', resp[0].p_error);
          this.modalVisible = false;
        } else {
          this.eventos.mensaje('warning', resp[0].p_error);
        }
      }, (err) => {
        this.eventos.loading(false);
        this.eventos.mensaje('error', 'Error en el servidor, intente nuevamente...');
      });
    }
  
    handleCancel(): void {
      console.log('Button cancel clicked!');
      this.modalVisible = false;
    }
  }
  