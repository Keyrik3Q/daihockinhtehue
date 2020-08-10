import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ApiService } from '../common/api-service/api.service';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginCookie } from '../common/core/login-cookie';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: LoginComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [ApiService, LoginCookie],
})
export class LoginModule { }
