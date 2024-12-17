import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent {
    constructor(private router: Router) { }

    goToHome(): void {
        this.router.navigate(['/']);
    }
}
