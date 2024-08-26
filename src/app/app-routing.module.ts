import { AlumnsModule } from './main/pages/alumns/alumns.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from "./layout/app.layout.component";

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '', component: AppLayoutComponent,
        children: [
          { path: '', loadChildren: () => import('./main/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
          { path: 'alumns', loadChildren: () => import('./main/pages/alumns/alumns.module').then(m => m.AlumnsModule) }
        ]
      },
    ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
