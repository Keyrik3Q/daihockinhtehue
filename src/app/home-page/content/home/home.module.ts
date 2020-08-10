import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common'; 
import { RouterModule } from '@angular/router'; 
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    TransferHttpCacheModule,  
    CommonModule,  
    RouterModule.forChild([ 
      {
        path: '', component: HomeComponent, children: [ 
        ],
      } 
    ]),
  ]
})
export class HomeModule { }
