import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from 'src/app/common/validations/must-match.validator';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Subscription } from 'rxjs';
import { Md5 } from 'ts-md5';
import { Sys_member } from 'src/app/common/models/40sys_member.models';

@Component({
  selector: 'app-h1-change-pass-word',
  templateUrl: './h1-change-pass-word.component.html',
  styleUrls: ['./h1-change-pass-word.component.scss'],
})
export class H1ChangePassWordComponent implements OnInit {
  subscription: Subscription[] = [];

  // model binding insert
  sys_member: Sys_member;
  sys_memberId: string;

  // validate
  form: FormGroup;

  //old password
  oldpassword: string;

  //new password
  newpassword: string;

  //re password
  repassword: string;

  //value hide
  hide = true;
  hide1 = true;
  hide2 = true;

  constructor(private api: ApiService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group(
      {
        password: [null, [Validators.required, Validators.maxLength(30)]],
        newpassword: [
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ],
        ],
        repassword: [
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ],
        ],
      },
      { validator: MustMatch('newpassword', 'repassword') }
    );
    this.passwordMd5 = new Md5();
  }

  //data password
  passwordMd5: any;

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    // get id staff has been logged
    if (this.api.getSysMemberValue != null) {
      this.sys_memberId = this.api.getSysMemberValue.id;

      this.onLoadDataStaff();
    }
  }

  /**
   * on Load DataStaff
   */
  onLoadDataStaff() {
    const param = {
      id: this.sys_memberId,
    };

    this.subscription.push(
      this.api.excuteAllByWhat(param, '219').subscribe((data) => {
        if (data.length > 0) {
          this.sys_member = data[0];
        }
      })
    );
  }

  /**
   * onChangePasswordMD5
   */
  onChangePasswordMD5() {
    this.passwordMd5 = Md5.hashStr(this.oldpassword).toString();
  
  }

  /**
   * onChangePassword
   */
  onChangePassword() {
    // return if error
    if (this.form.status != 'VALID') {
      this.api.showWarning('Vui lòng nhập các mục đánh dấu *');
      return;
    }
    this.onChangePasswordMD5();

    if (this.passwordMd5 == this.sys_member.password) {
      this.sys_member.password = Md5.hashStr(this.newpassword).toString();
      this.subscription.push(
        this.api.excuteAllByWhat(this.sys_member, '42').subscribe((data) => {
          this.api.showSuccess('Cập nhật mật khẩu thành công!');
        })
      );
    } else {
      this.api.showError('Mật khẩu cũ chưa đúng');
    }
    this.onLoadDataStaff();
    this.onCancelClick();
  }

  /**
   * onCancelClick
   */
  onCancelClick() {
    // clear forms
    this.form.reset();
  }
}
