import { Component, OnInit } from '@angular/core';
import { Alumn } from '../../../interfaces/alumn.interface';
import { AlumnsService } from '../../../services/alumns.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-alumn',
  templateUrl: './alumn.component.html',
  styleUrl: './alumn.component.scss'
})
export class AlumnComponent implements OnInit {

  public alumn?: Alumn;

  constructor( private alumnService: AlumnsService,
    private activatedRoute: ActivatedRoute,
    private router:Router) {}

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      delay(1000),
      switchMap( ({ id }) => this.alumnService.getAlumnById(id)),
      tap(alumn => {
        if (!alumn) {
          this.router.navigate(['/alumns']);
        }
      }),
      catchError((error) => {
        this.router.navigate(['/alumns']);
        return of(null);
      })
    )
    .subscribe(alumn => {
      if (alumn) {
        this.alumn = alumn;
      }
    });
  }
}
