import { Component } from '@angular/core';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Alumn } from '../../../interfaces/alumn.interface';
import { AlumnsService } from '../../../services/alumns.service';

@Component({
  selector: 'app-alumn-list',
  templateUrl: './alumn-list.component.html',
  styleUrl: './alumn-list.component.scss'
})
export class AlumnListComponent {

  public alumns: Alumn[] = [];
  public showedAlumns: Alumn[] = [];
  selectedAlumnAdvanced: string | undefined;
  filteredAlumns!: any[];

  constructor( private alumnsService: AlumnsService ) {}

  ngOnInit(): void {
    this.alumnsService.getAlumns()
      .subscribe( alumns => {
        this.alumns = alumns;
        this.showedAlumns = this.alumns;
      })
  }

  filterAlumns(event: AutoCompleteCompleteEvent) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.alumns as any[]).length; i++) {
          let alumn = (this.alumns as any[])[i];
          if (alumn.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(alumn);
          }
      }

      this.filteredAlumns = filtered;
      this.showedAlumns = this.filteredAlumns
  }

  onAlumnSelect(event: AutoCompleteSelectEvent) {
    let alumn = event.value as Alumn;
    this.selectedAlumnAdvanced = alumn.nombre + " " + alumn.apellido;
    this.showedAlumns = [alumn];
  }

  restoreAlumns() {
    this.showedAlumns = this.alumns;
  }

}
