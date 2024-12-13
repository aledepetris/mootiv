import { Pipe, PipeTransform } from '@angular/core';
import { Trainer } from '../../interfaces/trainer.interface';

@Pipe({
    name: 'trainerImage'
})
export class TrainerImagePipe implements PipeTransform {

    transform(trainer: Trainer): string {

        if (trainer.alt_img) return trainer.alt_img;

        return 'assets/no-image.png';

    }

}
