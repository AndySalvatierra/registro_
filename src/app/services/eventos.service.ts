import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  public _NOMBRE_APP: string = 'UTM SIPI';
  public _AUTH_TOKEN: string = 'auth_token_sipi_utm';
  public _DATOS_GENERALES_LOGIN: string = 'datos_generales_login';
  public _MENU_DEFECTO: string = 'menu_defecto_sipi';

  public _ANIO_INICIO = 2022;
  public _ANIO_FIN = 2026;

  public usuario = {
    p_error: "",
    p_status: 0,
    p_roles: [{
      descripcion: 'NO DEFINIDO'
    }],
    p_aplicacion: [{
      descripcion: 'NO DEFINIDO'
    }],
    p_modulo: [{
      descripcion: 'NO DEFINIDO'
    }],
    p_rol_defecto: -1,
    p_rol_defecto_descripcion: "",
    p_aplicacion_defecto: -1,
    p_aplicacion_defecto_descripcion: "",
    p_modulo_defecto: -1,
    p_modulo_defecto_descripcion: "",
    p_menu_defecto: [{
      menu_rol_menu: {
        descripcion: "NO DEFINIDO",
        ruta: ""
      }
    }],
    p_funcionario: "",
    p_idpersonal: -1,
    p_indice_puesto_nombre: "",
    p_cedula: "",
    p_nombres: "",
    p_apellidos: "",
    p_escuelas: "",
    p_departamentos: ""
  };

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private message: NzMessageService
  ) {

  }

  public cerrar_sesion() {
    console.log(this._AUTH_TOKEN)
    localStorage.removeItem(this._AUTH_TOKEN);
    sessionStorage.removeItem(this._DATOS_GENERALES_LOGIN);
    sessionStorage.removeItem(this._MENU_DEFECTO);
    this.router.navigate(['login']);
  }

  public validar_token(sesion: string) {
    if (sesion == 'False') {
      this.mensaje('warning', 'Su sesión ha expirado, inicie sesión nuevamente...');
      this.cerrar_sesion();
      return;
    }
  }

  public loading(dato: any) {
    if (dato) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

  public mensaje(type: string, message: string) {
    this.message.create(type, message);
  }

  public formatear_fecha(fecha: any, tipo: string) {
    if (tipo == "COMPLETA") {
      return moment(fecha).format("DD/MM/YYYY HH:mm:ss");
    } else {
      return moment(fecha).format("DD/MM/YYYY");
    }
  }

  public activar_formulario_sga(objeto: any): any {
    // if (semestre != 1) { objeto.reverse(); }
    if (!objeto) {
      return false;
    } else {
      if (objeto[0].origen == "SGA") {
        return true;
      } else {
        return false;
      }
    }
  }

  public activar_formulario_sga_2(objeto: any): any {
    if (!objeto) {
      return false;
    } else {
      if (objeto[objeto.length - 1].origen == "SGA") {
        return true;
      } else {
        return false;
      }
    }
  }

  public activar_formulario_sipi(objeto: any): any {
    // if (semestre != 1) { objeto.reverse(); }
    if (!objeto) {
      return false;
    } else {
      if (objeto[0].origen == "SIPI") {
        return true;
      } else {
        return false;
      }
    }
  }

  public activar_formulario_sipi_2(objeto: any): any {
    if (!objeto) {
      return false;
    } else {
      if (objeto[objeto.length - 1].origen == "SIPI") {
        return true;
      } else {
        return false;
      }
    }
  }

  public activar_formulario_api(objeto: any): any {
    // if (semestre != 1) { objeto.reverse(); }
    if (!objeto) {
      return false;
    } else {
      if (objeto[0].origen == "API") {
        return true;
      } else {
        return false;
      }
    }
  }

  public activar_formulario_api_2(objeto: any): any {
    if (!objeto) {
      return false;
    } else {
      if (objeto[objeto.length - 1].origen == "API") {
        return true;
      } else {
        return false;
      }
    }
  }

  public completar_nombre(texto: any, objeto: any): any {
    return typeof texto === "undefined" ? objeto : texto;
  }

  public procesar_resultado_evaluacion(resultados: any, configuracion: any, semestre: any): any {
    // let configuracion = semestre == 'S1' ? configuracion_p : configuracion_p.reverse();
    console.log(resultados);
    console.log(configuracion);
    console.log(semestre)
    // console.log(resultados[0].tipo)    
    if (resultados) {
      if (resultados[0].tipo == "campos") {
        let valor = 0;
        let total = 0;
        let porcentaje = 0;
        let texto = "";
        let es_porcentaje = false;
        let es_numero = false;
        let es_texto = false;
        let es_producto = false;
        for (let i = 0; i < resultados[0].objeto.length; i++) {
          let item = resultados[0].objeto[i];
          // console.log(configuracion[0].objeto)
          let indice = semestre == 'S1' ? 0 : 1;
          console.log(typeof configuracion[indice].objeto[i])
          let tipo = typeof configuracion[indice].objeto[i] === "undefined" ? "no_definido" : configuracion[indice].objeto[i].tipo;
          if (tipo == "valor") {
            valor += parseFloat(item.valor);
          }

          if (tipo == "porcentaje") {
            es_porcentaje = true;
            total += parseFloat(item.valor);
          }

          if (tipo == "numero") {
            es_numero = true;
            total += parseFloat(item.valor);
          }

          if (tipo == "texto") {
            es_texto = true;
            texto = item.valor;
          }

          if (tipo == "producto") {
            es_producto = true;
            total *= parseFloat(item.valor);
          }

          if (tipo == "no_definido") {
            return "ERROR AL PROCESAR, SUBIR NUEVAMENTE LA INFORMACIÓN";
          }
        }
        // console.log(es_porcentaje, valor, total)
        // configuracion_p = configuracion_p.reverse();
        if (es_porcentaje) {
          porcentaje = (total * 100) / valor;
          return "PORCENTAJE: " + (isNaN(porcentaje) ? 0 : porcentaje.toFixed(2)) + " %";
        } else if (es_numero) {
          return "TOTAL: " + total.toFixed(2);
        } else if (es_texto) {
          return texto;
        } else if (es_producto) {
          return "TOTAL: " + total.toFixed(2);
        } else {
          return "SIN CONFIGURAR";
        }
      } else if (resultados[0].tipo == "api") {
        let total = 0;
        for (let i = 0; i < resultados[0].objeto.length; i++) {
          let item = resultados[0].objeto[i];
          total += parseFloat(item.valor);
        }
        return "TOTAL: " + total.toFixed(2);
      } else if (resultados[0].tipo == "adjunto") {
        return "TOTAL: " + (resultados[0].objeto.length > 0 ? resultados[0].objeto[0].observacion : 0);
      } else {
        return "0"; //"ORIGEN NO COMPUTABLE";
      }
    } else {
      return "SIN RESULTADOS"
    }
  }

  public procesar_resultado_evaluacion_anual(resultados: any, configuracion: any): any {
    console.log("*************************************************")
    console.log(resultados);
    console.log(resultados.length)
    console.log(configuracion)
    console.log("*************************************************")
    // console.log(configuracion);
    if (resultados) {
      let valor = 0;
      let total = 0;
      let porcentaje = 0;
      let texto = "";
      let es_porcentaje = false;
      let es_numero = false;
      let es_texto = false;
      let es_producto = false;
      let existe_valor_anual = "N";
      for (let x = 0; x < resultados.length; x++) {
        if (typeof resultados[x].objeto !== "undefined") {
          for (let i = 0; i < resultados[x].objeto.length; i++) {
            let tipo = typeof resultados[x].objeto[i] === "undefined" ? "no_definido" : resultados[x].objeto[i].tipo;
            if (typeof tipo !== "undefined") {
              if (tipo.includes("_a")) {
                existe_valor_anual = "S";
              }
            }
          }
        }
      }

      for (let x = 0; x < resultados.length; x++) {
        if (resultados[x].tipo == "campos") {
          // let valor = 0;
          // let total = 0;
          // let porcentaje = 0;
          // let texto = "";
          // let es_porcentaje = false;
          // let es_numero = false;
          // let es_texto = false;
          // let es_producto = false;
          for (let i = 0; i < resultados[x].objeto.length; i++) {
            let item = resultados[x].objeto[i];
            // console.log(configuracion[x].objeto)
            // let tipo = typeof configuracion[x].objeto[i] === "undefined" ? "no_definido" : configuracion[x].objeto[i].tipo;
            let tipo = typeof resultados[x].objeto[i] === "undefined" ? "no_definido" : resultados[x].objeto[i].tipo;
            if (existe_valor_anual == "S") {
              if (tipo == "valor_a") {
                // if (tipo == "valor" || tipo == "valor_a") {
                existe_valor_anual = "S";
                valor += parseFloat(item.valor);
              }

              if (tipo == "porcentaje_a") {
                // if (tipo == "porcentaje" || tipo == "porcentaje_a") {
                es_porcentaje = true;
                existe_valor_anual = "S";
                total += parseFloat(item.valor);
              }

              if (tipo == "numero_a") {
                // if (tipo == "numero" || tipo == "numero_a") {
                es_numero = true;
                existe_valor_anual = "S";
                total += parseFloat(item.valor);
              }

              if (tipo == "texto_a") {
                // if (tipo == "texto" || tipo == "texto_a") {
                es_texto = true;
                existe_valor_anual = "S";
                texto = item.valor;
              }

              if (tipo == "producto_a") {
                // if (tipo == "producto" || tipo == "producto_a") {
                es_producto = true;
                existe_valor_anual = "S";
                total *= parseFloat(item.valor);
              }
            }

            if (tipo == "no_definido") {
              if ((resultados.length - 1) == x) {
                return "ERROR AL PROCESAR, SUBIR NUEVAMENTE LA INFORMACIÓN";
              }
            }

            // EN CASO DE NO EXISTE VARIABLES ANUALES
            let valor_observacion = typeof item.valor === "undefined" ? (!item.observacion.length ? 0 : item.observacion) : item.valor;
            console.log("existe_valor_anual", existe_valor_anual)
            if (existe_valor_anual == "N") {
              console.log("valor:", valor_observacion.length, tipo, item.valor)
              if (tipo == "valor") {
                valor += typeof item.valor === "undefined" ? 0 : parseFloat(item.valor);
              }

              if (tipo == "porcentaje") {
                es_porcentaje = true;
                total += typeof item.valor === "undefined" ? 0 : parseFloat(item.valor);
              }

              if (tipo == "numero") {
                es_numero = true;
                total += typeof item.valor === "undefined" ? 0 : parseFloat(item.valor);
              }

              if (tipo == "texto") {
                es_texto = true;
                texto = item.valor;
              }

              if (tipo == "producto") {
                es_producto = true;
                total *= typeof item.valor === "undefined" ? 0 : parseFloat(item.valor);
              }
            }
          }
          console.log(es_porcentaje, valor, total)
          if (es_porcentaje) {
            porcentaje = (total * 100) / valor;
            if ((resultados.length - 1) == x) {
              return "PORCENTAJE: " + (isNaN(porcentaje) ? 0 : porcentaje.toFixed(2)) + " %";
            }
          } else if (es_numero) {
            if ((resultados.length - 1) == x) {
              return "TOTAL: " + (isNaN(total) ? 0 : total.toFixed(2));
            }
          } else if (es_texto) {
            if ((resultados.length - 1) == x) {
              return texto;
            }
          } else if (es_producto) {
            if ((resultados.length - 1) == x) {
              return "TOTAL: " + (isNaN(total) ? 0 : total.toFixed(2));
            }
          } else {
            // console.log("SIN CONFIGURAR", valor);
            if ((resultados.length - 1) == x) {
              return "SIN CONFIGURAR";
            }
          }
        } else if (resultados[x].tipo == "api") {          
          let total = 0;
          for (let i = 0; i < resultados[x].objeto.length; i++) {
            let item = resultados[x].objeto[i];
            total += parseFloat(item.valor);
            // alert(item.valor + " " + resultados.length + " " + x)
          }
          if ((resultados.length - 1) == x) {
            alert("mesura")
            return "TOTAL: " + (isNaN(total) ? 0 : total.toFixed(2));
          }
          if(resultados.length == 2) {
            return "TOTAL: " + (isNaN(total) ? 0 : total.toFixed(2));
          }
        } else if (resultados[x].tipo == "adjunto") {
          if ((resultados.length - 1) == x) {
            if (es_porcentaje) {
              porcentaje = (total * 100) / valor;
              if ((resultados.length - 1) == x) {
                return "PORCENTAJE: " + (isNaN(porcentaje) ? 0 : porcentaje.toFixed(2)) + " %";
              }
            } else if (es_numero) {
              if ((resultados.length - 1) == x) {
                return "TOTAL: " + (isNaN(total) ? 0 : total.toFixed(2));
              }
            } else if (es_texto) {
              if ((resultados.length - 1) == x) {
                return texto;
              }
            } else if (es_producto) {
              if ((resultados.length - 1) == x) {
                return "TOTAL: " + (isNaN(total) ? 0 : total.toFixed(2));
              }
            } else {
              // console.log("SIN CONFIGURAR", valor);
              if ((resultados.length - 1) == x) {
                return "SIN CONFIGURAR";
              }
            }
            // return "TOTAL: " + resultados[x].objeto[0].observacion;
          }
        } else {
          return "0";/*"ORIGEN NO COMPUTABLE"*/;
        }
      }
    } else {
      return "SIN RESULTADOS"
    }
  }

  public procesar_resultado_evaluacion_guardar(resultados: any, configuracion: any): any {
    console.log(resultados)
    console.log(configuracion)
    if (resultados) {
      if (resultados[0].tipo == "campos") {
        let valor = 0;
        let total = 0;
        let porcentaje = 0;
        let texto = "";
        let es_porcentaje = false;
        let es_numero = false;
        let es_texto = false;
        let es_producto = false;
        for (let i = 0; i < resultados[0].objeto.length; i++) {
          let item = resultados[0].objeto[i];
          let tipo = typeof configuracion[0].objeto[i] === "undefined" ? "no_definido" : configuracion[0].objeto[i].tipo;
          if (tipo == "valor") {
            valor += parseFloat(item.valor);
          }

          if (tipo == "porcentaje") {
            es_porcentaje = true;
            total += parseFloat(item.valor);
          }

          if (tipo == "numero") {
            es_numero = true;
            total += parseFloat(item.valor);
          }

          if (tipo == "texto") {
            es_texto = true;
            texto = item.valor;
          }

          if (tipo == "producto") {
            es_producto = true;
            total *= parseFloat(item.valor);
          }

          if (tipo == "no_definido") {
            return {
              tipo: "ERROR",
              porcentaje: 0,
              numero: 0,
              texto: "N",
              producto: 0
            };
          }
        }
        // console.log(es_porcentaje, valor, total)
        if (es_porcentaje) {
          // porcentaje = (total * 100) / valor;
          // return "PORCENTAJE: " + porcentaje.toFixed(2) + " %";
          return {
            tipo: "PORCENTAJE",
            porcentaje: total,
            numero: valor,
            texto: "N",
            producto: 0
          };
        } else if (es_numero) {
          // return "TOTAL: " + total.toFixed(2);
          return {
            tipo: "NUMERO",
            porcentaje: 0,
            numero: total,
            texto: "N",
            producto: 0
          };
        } else if (es_texto) {
          // return texto;
          return {
            tipo: "TEXTO",
            porcentaje: 0,
            numero: 0,
            texto: texto,
            producto: 0
          };
        } else if (es_producto) {
          // return "TOTAL: " + total.toFixed(2);
          return {
            tipo: "PRODUCTO",
            porcentaje: 0,
            numero: 0,
            texto: "N",
            producto: total
          };
        } else {
          // return "SIN CONFIGURAR";
          return {
            tipo: "SIN CONFIGURAR",
            porcentaje: 0,
            numero: 0,
            texto: "N",
            producto: 0
          };
        }
      } else if (resultados[0].tipo == "api") {
        let total = 0;
        for (let i = 0; i < resultados[0].objeto.length; i++) {
          let item = resultados[0].objeto[i];
          total += parseFloat(item.valor);
        }
        // return "TOTAL: " + total.toFixed(2);
        return {
          tipo: "NUMERO",
          porcentaje: 0,
          numero: total,
          texto: "N",
          producto: 0
        };
      } else if (resultados[0].tipo == "adjunto") {
        return {
          tipo: "NUMERO",
          porcentaje: 0,
          numero: parseFloat(resultados[0].objeto[0].observacion),
          texto: "N",
          producto: 0
        };
      } else {
        // return "ORIGEN NO COMPUTABLE";
        return {
          tipo: "ORIGEN NO COMPUTABLE",
          porcentaje: 0,
          numero: 0,
          texto: "N",
          producto: 0
        };
      }
    } else {
      // return "SIN RESULTADOS"
      return {
        tipo: "SIN RESULTADOS",
        porcentaje: 0,
        numero: 0,
        texto: "N",
        producto: 0
      };
    }
  }
}
