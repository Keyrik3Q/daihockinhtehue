import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginCookie } from '../../common/core/login-cookie';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Sys_member } from 'src/app/common/models/40sys_member.models';
import { Subscription } from 'rxjs'; 

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    sysmemberid:number;
    
    subscription: Subscription[] = [];

    permission1: boolean = false;
    permission2: boolean = false;
    permission3: boolean = false;
    permission4: boolean = false;
    permission5: boolean = false;
    permission6: boolean = false;
    permission7: boolean = false;
    permission8: boolean = false;
    permission9: boolean = false;
    permission10: boolean = false;
    permission11: boolean = false;
    permission12: boolean = false;
    permission13: boolean = false;
    permission14: boolean = false;
    permission15: boolean = false;
    permission16: boolean = false;
    permission17: boolean = false;
    permission18: boolean = false;
    permission19: boolean = false;
    permission20: boolean = false;
    permission21: boolean = false;

    sysmember: Sys_member;
    
    menuFlag: boolean = false;
    menuMobileFlag: boolean = false;
    settingButton: boolean = false;
    menuMobileStaff:boolean = false;
    searchFlag: boolean = false;
    isMobile: boolean = false; 
    menuLogo: boolean = true;

    test: any;

    constructor(private login: LoginCookie, public api: ApiService) {
        this.sysmember =  this.api.getSysMemberValue;
        this.sysmemberid =  this.api.getSysMemberValue.id;
    }

    ngOnInit() {
        this.isMobile = this.isMobileDevice();
        document.cookie = "test2=World";  
        const param = {
            'id':this.sysmemberid,
        }
        this.subscription.push(this.api.excuteAllByWhat(param, '47').subscribe(data => {

            if (data[0].permission.search('2') >= 0) {
                this.permission1 = true;
            }
            if (data[0].permission.search('3') >= 0) {
                this.permission2 = true;
            }
            if (data[0].permission.search('4') >= 0) {
                this.permission3 = true;
            }
            if (data[0].permission.search('17') >= 0) {
                this.permission4 = true;
            }
            if (data[0].permission.search('38') >= 0) {
                this.permission5 = true;
            }
            if (data[0].permission.search('39') >= 0) {
                this.permission6 = true;
            }
            if (data[0].permission.search('54') >= 0) {
                this.permission7 = true;
            }
            if (data[0].permission.search('61') >= 0) {
                this.permission8 = true;
            }
            if (data[0].permission.search('65') >= 0) {
                this.permission9 = true;
            }
            if (data[0].permission.search('67') >= 0) {
                this.permission10 = true;
            }
            if (data[0].permission.search('69') >= 0) {
                this.permission11 = true;
            }
            if (data[0].permission.search('71') >= 0) {
                this.permission12 = true;
            }
            if (data[0].permission.search('72') >= 0) {
                this.permission13 = true;
            }
            if (data[0].permission.search('79') >= 0) {
                this.permission14 = true;
            }
            if (data[0].permission.search('80') >= 0) {
                this.permission15 = true;
            }
            if (data[0].permission.search('86') >= 0) {
                this.permission16 = true;
            }
            if (data[0].permission.search('87') >= 0) {
                this.permission17 = true;
            }
            if (data[0].permission.search('94') >= 0) {
                this.permission18 = true;
            }
            if (data[0].permission.search('95') >= 0) {
                this.permission19 = true;
            }
            if (data[0].permission.search('98') >= 0) {
                this.permission20 = true;
            }
            if (data[0].permission.search('99') >= 0) {
                this.permission21 = true;
            }
        }));
    }

    isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }; 

    //log out SysMember
    logOutSysMember(){
        this.api.logoutSysMember();
    }
}
