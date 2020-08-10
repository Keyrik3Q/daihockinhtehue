import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table'; 
import { E2LinkComponent } from './e2-link.component'; 
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';


@NgModule({
  declarations: [E2LinkComponent],
  imports: [
    TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: E2LinkComponent,
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
    MatButtonModule
  ],
  entryComponents: [GManageFileComponent]
})
export class E2LinkModule { }
