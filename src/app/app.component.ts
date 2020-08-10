import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'hce-edu';
 
    ckeditorContent: string = '<p>Some html</p>';

    constructor(private router: Router) {
        // this.router.navigate(['/a1-system-menu']);
    } 
}
