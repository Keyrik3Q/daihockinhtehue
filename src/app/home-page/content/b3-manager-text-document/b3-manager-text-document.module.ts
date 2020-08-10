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
import { B3ManagerTextDocumentComponent,ManagerTextDialog } from './b3-manager-text-document.component'; 
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [B3ManagerTextDocumentComponent,ManagerTextDialog],
  imports: [
    TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: B3ManagerTextDocumentComponent,
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
    MatDialogModule,
    CKEditorModule
  ],
  entryComponents: [ManagerTextDialog]
})
export class B3ManagerTextDocumentModule { }
