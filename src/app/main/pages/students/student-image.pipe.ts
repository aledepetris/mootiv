import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '../../interfaces/student.interface';

@Pipe({
    name: 'studentImage'
})
export class StudentImagePipe implements PipeTransform {

    transform(student: Student): string {
        if (student.alt_img) return student.alt_img;
        return 'assets/no-image.png';
    }

}
