import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-alumns',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
  ],
  templateUrl: './alumns.component.html',
  styleUrl: './alumns.component.css'
})
export class AlumnsComponent implements OnInit {
  displayedColumns: string[] = ['photo', 'name', 'actions'];
  dataSource = new MatTableDataSource<Alumn>(ELEMENT_DATA);

  ngOnInit() {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addAlumn() {
    // Lógica para agregar nuevo alumno
  }

  viewAlumn(Alumn: Alumn) {
    // Lógica para ver detalles del alumno
  }

  editAlumn(Alumn: Alumn) {
    // Lógica para editar alumno
  }

  deleteAlumn(Alumn: Alumn) {
    // Lógica para eliminar alumno
  }
}

export interface Alumn {
  photoUrl: string;
  name: string;
}

const ELEMENT_DATA: Alumn[] = [
  {photoUrl: 'path-to-photo', name: 'Alumno 1'},
  {photoUrl: 'path-to-photo', name: 'Alumno 2'},
  // Agrega más datos aquí
];
