import { Component, Input } from '@angular/core';
import { Trainer } from '../../../../interfaces/trainer.interface';

@Component({
  selector: 'app-trainer-card',
  templateUrl: './trainer-card.component.html',
  styleUrl: './trainer-card.component.scss'
})
export class TrainerCardComponent {

  @Input()
  public trainer!: Trainer;

  constructor() { }

  ngOnInit(): void {
      if ( !this.trainer ) throw Error('Trainer property is required')
  }

}
