import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule} from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table'; 
import { F1CarlenderWorkComponent } from './f1-carlender-work.component'; 
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [F1CarlenderWorkComponent],
  imports: [
    TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: F1CarlenderWorkComponent,
        children: []
      }
    ]),
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatPaginatorModule, 
    MatSelectModule,
    MatSortModule,
    MatTableModule, 
    MatInputModule,
    MatButtonModule,
    CKEditorModule
  ]
})
export class F1CarlenderWorkModule {}
