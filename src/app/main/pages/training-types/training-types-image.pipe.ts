import { Pipe, PipeTransform } from '@angular/core';
import { TrainingType } from '../../interfaces/training-type.interface';

@Pipe({
    name: 'equipmmentImage'
})
export class TrainingTypeImagePipe implements PipeTransform {

    transform(trainer: TrainingType): string {

        if (trainer.alt_img) return trainer.alt_img;

        return 'assets/no-image.png';

    }

}
