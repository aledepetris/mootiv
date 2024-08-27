import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnListComponent } from './alumn-list/alumn-list.component';
import { AlumnNewComponent } from './alumn-new/alumn-new.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AlumnListComponent },
    { path: 'new', component: AlumnNewComponent},
    { path: '**', redirectTo: '/notfound' }
])],
  exports: [RouterModule]
})
export class AlumnsRoutingModule { }
