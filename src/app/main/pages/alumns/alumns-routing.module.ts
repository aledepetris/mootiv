import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnListComponent } from './alumn-list/alumn-list.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', data: { breadcrumb: 'Prime Icons' }, component: AlumnListComponent },
    { path: '**', redirectTo: '/notfound' }
])],
  exports: [RouterModule]
})
export class AlumnsRoutingModule { }
