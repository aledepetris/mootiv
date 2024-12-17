import { Pipe, PipeTransform } from '@angular/core';
import { Muscle } from '../../interfaces/muscle.interface';

@Pipe({
    name: 'muscleImage'
})
export class MuscleImagePipe implements PipeTransform {

    transform(muscle: Muscle): string {

        if (muscle.alt_img) return muscle.alt_img;

        return 'assets/no-image.png';

    }

}
