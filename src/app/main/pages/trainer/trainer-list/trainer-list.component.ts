import { Component } from '@angular/core';
import { Trainer } from '../../../interfaces/trainer.interface';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { TrainersService } from '../../../services/trainers.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-trainer-list',
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.scss'
})
export class TrainerListComponent {

  public trainers: Trainer[] = [];
  public showedTrainer: Trainer[] = [];
  selectedTrainerAdvanced: string | undefined;
  filteredTrainer!: any[];

  constructor( private trainerService: TrainersService ) {}

  ngOnInit(): void {
    this.trainerService.getTrainers()
      .subscribe( trainers => {
        this.trainers = trainers;
        this.showedTrainer = this.trainers;
      })

  }

  filterTrainer(event: AutoCompleteCompleteEvent) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.trainers as any[]).length; i++) {
          let trainer = (this.trainers as any[])[i];
          if (trainer.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(trainer);
          }
      }

      this.filteredTrainer = filtered;
      this.showedTrainer = this.filteredTrainer
  }

  onTrainerSelect(event: AutoCompleteSelectEvent) {
    let trainer = event.value as Trainer;
    this.selectedTrainerAdvanced = trainer.name + " " + trainer.lastName;
    this.showedTrainer = [trainer];
  }

  restoreTrainer() {
    this.showedTrainer = this.trainers;
  }

}
