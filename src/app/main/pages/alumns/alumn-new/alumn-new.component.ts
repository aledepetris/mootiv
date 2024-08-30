import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-alumn-new',
  templateUrl: './alumn-new.component.html',
  styleUrl: './alumn-new.component.scss'
})
export class AlumnNewComponent implements OnInit {

  selectedState: any = null;

  ngOnInit(): void {

  }

  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
  ];

}
