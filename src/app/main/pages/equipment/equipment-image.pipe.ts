import { Pipe, PipeTransform } from '@angular/core';
import { Equipment } from '../../interfaces/equipment.interface';

@Pipe({
    name: 'equipmmentImage'
})
export class EquipmentImagePipe implements PipeTransform {

    transform(trainer: Equipment): string {

        if (trainer.alt_img) return trainer.alt_img;

        return 'assets/no-image.png';

    }

}
