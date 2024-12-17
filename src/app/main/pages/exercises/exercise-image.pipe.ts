import { Pipe, PipeTransform } from '@angular/core';
import { Exercise } from '../../interfaces/exercise.interface';

@Pipe({
    name: 'exerciseImage'
})
export class ExerciseImagePipe implements PipeTransform {

    transform(exercise: Exercise): string {

        if (exercise.alt_img) return exercise.alt_img;
        return 'assets/no-image.png';

    }

}
