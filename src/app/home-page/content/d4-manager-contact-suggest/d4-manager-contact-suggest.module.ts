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
import { D4ManagerContactSuggestComponent, ManagerContactSuggestDialog } from './d4-manager-contact-suggest.component'; 
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [D4ManagerContactSuggestComponent,ManagerContactSuggestDialog ], 
  imports: [
    TransferHttpCacheModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: D4ManagerContactSuggestComponent,
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
  entryComponents: [ManagerContactSuggestDialog]
})
export class D4ManagerContactSuggestModule { }
