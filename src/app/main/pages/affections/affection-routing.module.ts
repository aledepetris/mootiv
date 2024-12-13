import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffectionListComponent } from './affection-list/affection-list.component';
import { AffectionComponent } from './affection/affection.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AffectionListComponent },
        { path: 'new', component: AffectionComponent },
        { path: ':id', component: AffectionComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class AffectionsRoutingModule { }
