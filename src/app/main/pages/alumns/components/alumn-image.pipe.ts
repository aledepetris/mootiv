import { Pipe, PipeTransform } from '@angular/core';
import { Alumn } from '../../../interfaces/alumn.interface';

@Pipe({
  name: 'alumnImage'
})
export class AlumnImagePipe implements PipeTransform {

  transform( alumn:  Alumn): string {

    if ( alumn.alt_img ) return alumn.alt_img;

    return 'assets/no-image.png';

  }

}
