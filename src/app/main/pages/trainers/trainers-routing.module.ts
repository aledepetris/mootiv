import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerListComponent } from './trainer-list/trainer-list.component';
import { TrainerComponent } from './trainer/trainer.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: TrainerListComponent },
    { path: 'new', component: TrainerComponent},
    { path: ':id', component: TrainerComponent },
    { path: '**', redirectTo: '' }
])],
  exports: [RouterModule]
})
export class TrainersRoutingModule { }
