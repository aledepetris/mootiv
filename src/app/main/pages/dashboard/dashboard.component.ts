import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

    subscription!: Subscription;

    constructor(private router: Router) { }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
