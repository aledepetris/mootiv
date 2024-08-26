import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnsRoutingModule } from './alumns-routing.module';
import { AlumnListComponent } from './alumn-list/alumn-list.component';
import { AlumnCardComponent } from './components/alumn-card/alumn-card.component';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { AlumnImagePipe } from './components/alumn-image.pipe';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AlumnListComponent,
    AlumnCardComponent,
    AlumnImagePipe
  ],
  imports: [
    CommonModule,
    AlumnsRoutingModule,
    RouterModule,
    CardModule,
    DividerModule,
    ChipModule,
    ButtonModule,
    RippleModule,
    AutoCompleteModule,
    FormsModule
  ]
})
export class AlumnsModule { }
