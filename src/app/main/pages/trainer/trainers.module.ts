import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerListComponent } from './trainer-list/trainer-list.component';
import { TrainerNewComponent } from './trainer-new/trainer-new.component';
import { TrainerComponent } from './trainer/trainer.component';
import { RouterModule } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TimelineModule } from 'primeng/timeline';
import { TrainerCardComponent } from './components/trainer-card/trainer-card.component';
import { TrainerImagePipe } from './components/trainer-image.pipe';


@NgModule({
  declarations: [
    TrainerListComponent,
    TrainerNewComponent,
    TrainerComponent,
    TrainerCardComponent,
    TrainerImagePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    DividerModule,
    ChipModule,
    ButtonModule,
    RippleModule,
    AutoCompleteModule,
    CascadeSelectModule,
    DropdownModule,
    FormsModule,
    MultiSelectModule,
    InputTextareaModule,
    InputTextModule,
    ProgressSpinnerModule,
    TimelineModule
   ]
})
export class TrainerModule { }
