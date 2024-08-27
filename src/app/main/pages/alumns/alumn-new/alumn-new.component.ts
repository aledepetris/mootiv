import { Component } from '@angular/core';

@Component({
  selector: 'app-alumn-new',
  templateUrl: './alumn-new.component.html',
  styleUrl: './alumn-new.component.scss'
})
export class AlumnNewComponent {

  selectedState: any = null;

  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
  ];

}
