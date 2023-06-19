import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObjetivoEstrategicoInstitucionalComponent } from './objetivo-estrategico-institucional.component';

const routes: Routes = [
  { path: '', component: ObjetivoEstrategicoInstitucionalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjetivoEstrategicoInstitucionalRoutingModule { }
