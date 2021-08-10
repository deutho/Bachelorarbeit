import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { asyncScheduler, Observable, Subject } from 'rxjs';
import { observeOn, timeout } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChallangeRewardService {
    private subject = new Subject<any[]>();
    private keepAfterRouteChange = false;
    listOfMaps = [];

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert message
                    this.clear();
                }
            }
        });
    }

    getChallangeAlert(): Observable<any> {
        return this.subject.asObservable();
    }


    addReward(message: string, image: string, buttonText: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.listOfMaps.push({ header: message, image:image, buttonText:buttonText })
        this.subject.next(this.listOfMaps);
    }

    removeLatestReward(keepAfterRouteChange = false) {
        // removes one reward notification and updates the subject 0.5 sec later to show the next notification
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.listOfMaps.pop()
        setTimeout(() => this.subject.next(this.listOfMaps), 500) ;
        console.log(this.listOfMaps)
    }

    clear() {
        // clear by calling subject.next() without parameters
        this.subject.next();
    }
}