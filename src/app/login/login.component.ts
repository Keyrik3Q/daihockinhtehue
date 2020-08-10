import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../common/api-service/api.service';
import { Sys_member } from '../common/models/40sys_member.models';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // cyptoSaltHash = require('crypto-salt-hash');

  constructor(private router: Router, private api: ApiService) {
    
  }

  input: Sys_member;

  //data password  
  passwordMd5: string='';

  ngOnInit(): void {
    this.input = {
      username: '',
      password: '',
    };
  }

  /**
     * on Enter press
     * @param e 
     */
    onEnter(e) {
      if (e.keyCode == 13) {
          this.onLoginClick();
      }
  }

  /**
   * on Login Click
   */
  onLoginClick() {
    //change password MD5
    this.input.password = Md5.hashStr(this.passwordMd5).toString();
    this.api.excuteAllByWhat(this.input, '49').subscribe((data) => {
      if (data.length > 0) {
        localStorage.setItem('sysmemberSubject', JSON.stringify(data[0]));
        this.api.sysmemberSubject.next(data[0]);

        this.api.showSuccess('Đăng nhập Thành Công '); 
        window.location.href = 'http://hce.edu.vn/new/cmsadmin/#/manager';
        window.location.reload();
      } else {
        this.api.showError('Username hoặc Password đã sai');
      }
    });
  }

  /**
   * on Foget Password Click
   */
  onFogetPasswordClick() { }
}
