
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import {TransferHttpCacheModule} from "@nguniversal/common";
import { H1ChangePassWordComponent } from './h1-change-pass-word.component';



@NgModule({
  declarations: [H1ChangePassWordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: H1ChangePassWordComponent,
        children: [],
      },
    ]),
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatNativeDateModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSortModule,
    TransferHttpCacheModule,
  ],
})
export class H1ChangePassWordModule {}
