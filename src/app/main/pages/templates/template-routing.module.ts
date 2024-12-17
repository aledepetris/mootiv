import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateComponent } from './template/template.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TemplateListComponent },
        { path: 'new', component: TemplateComponent },
        { path: ':id', component: TemplateComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class TemplatesRoutingModule { }
