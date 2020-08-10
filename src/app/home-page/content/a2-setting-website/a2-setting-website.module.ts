import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table'; 
import { A2SettingWebsiteComponentt } from './a2-setting-website.component'; 
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [A2SettingWebsiteComponentt],
  imports: [
    TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: A2SettingWebsiteComponentt,
        children: []
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    MatCardModule,
    MatCheckboxModule,   
    MatPaginatorModule,  
    MatSelectModule,    
    MatSortModule,
    MatTableModule,   
    MatInputModule,
    MatButtonModule, 
  ]
})
export class A2SettingWebsiteModule {}
