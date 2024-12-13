import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentComponent } from './equipment/equipment.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EquipmentListComponent },
        { path: 'new', component: EquipmentComponent },
        { path: ':id', component: EquipmentComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class EquipmentsRoutingModule { }
