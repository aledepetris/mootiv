import { Pipe, PipeTransform } from '@angular/core';
import { ExerciseType } from '../../interfaces/exercise-type.interface';

@Pipe({
    name: 'equipmmentImage'
})
export class ExerciseTypeImagePipe implements PipeTransform {

    transform(trainer: ExerciseType): string {

        if (trainer.alt_img) return trainer.alt_img;

        return 'assets/no-image.png';

    }

}
