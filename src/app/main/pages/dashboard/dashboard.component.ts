import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    subscription!: Subscription;

    constructor() {}

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
