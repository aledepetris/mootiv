import { Pipe, PipeTransform } from '@angular/core';
import { Affection } from '../../interfaces/affection.interface';

@Pipe({
    name: 'equipmmentImage'
})
export class AffectionImagePipe implements PipeTransform {

    transform(trainer: Affection): string {

        if (trainer.alt_img) return trainer.alt_img;

        return 'assets/no-image.png';

    }

}
