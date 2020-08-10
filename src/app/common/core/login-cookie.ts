// import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core'; 

@Injectable()
export class LoginCookie {
    public accountLogin: string = '0';

    // constructor(
    //     private cookieService: CookieService
    // ) {

    // }

    // /**
    //  * setAccountLogin
    //  * @param value 
    //  */
    // public setAccountLogin(value: string) {
    //     this.cookieService.set('accountLogin', value);
    //     this.accountLogin = value;
    // }

    // /**
    //  * getAccountLogin
    //  */
    // public getAccountLogin(): string {
    //     this.accountLogin = this.cookieService.get('accountLogin');
    //     return this.accountLogin;
    // } 

}