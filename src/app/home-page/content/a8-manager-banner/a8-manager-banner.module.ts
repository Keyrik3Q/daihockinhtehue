import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { A8ManagerBannerComponent } from './a8-manager-banner.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';

@NgModule({
    declarations: [A8ManagerBannerComponent],
    imports: [
        TransferHttpCacheModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '', component: A8ManagerBannerComponent, children: [
                ],
            }
        ]),

        FormsModule,
        ReactiveFormsModule,

        MatCardModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule
    ],
    entryComponents: [GManageFileComponent]
})
export class A8ManagerBannerModule { }
