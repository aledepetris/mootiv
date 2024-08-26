import { Component, Input } from '@angular/core';
import { Alumn } from '../../../../interfaces/alumn.interface';

@Component({
  selector: 'app-alumn-card',
  templateUrl: './alumn-card.component.html',
  styleUrl: './alumn-card.component.scss'
})
export class AlumnCardComponent {

  @Input()
  public alumn!: Alumn;

  constructor() { }

  ngOnInit(): void {
      if ( !this.alumn ) throw Error('Alumn property is required')
  }

}
