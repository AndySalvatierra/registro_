import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { FullComponent } from './layout/full/full.component';
import { pruebaComponent } from './pages/prueba/prueba.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: pruebaComponent },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      { 
        path: 'dashboard', 
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) 
      },
      
      { 
        path: 'objetivo_estrategico_institucional', 
        loadChildren: () => import('./pages/modulo-plan-operativo/objetivo-estrategico-institucional/objetivo-estrategico-institucional.module').then(m => m.ObjetivoEstrategicoInstitucionalModule) 
      }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
