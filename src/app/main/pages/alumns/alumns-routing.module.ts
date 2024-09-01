import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnListComponent } from './alumn-list/alumn-list.component';
import { AlumnNewComponent } from './alumn-new/alumn-new.component';
import { AlumnComponent } from './alumn/alumn.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AlumnListComponent },
    { path: 'new', component: AlumnNewComponent},
    { path: ':id', component: AlumnComponent },
    { path: '**', redirectTo: '' }
])],
  exports: [RouterModule]
})
export class AlumnsRoutingModule { }
