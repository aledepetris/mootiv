import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { RouterModule } from '@angular/router';
import { NgFor, NgStyle } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgFor, NgStyle,
    MaterialModule,
    RouterModule,
    LayoutComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

}
