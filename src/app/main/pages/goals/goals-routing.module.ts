import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalComponent } from './goal/goal.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: GoalListComponent },
        { path: 'new', component: GoalComponent },
        { path: ':id', component: GoalComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class GoalsRoutingModule { }
