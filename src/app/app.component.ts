import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'mootiv-app-front';

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
      this.primengConfig.ripple = true;
  }

}
