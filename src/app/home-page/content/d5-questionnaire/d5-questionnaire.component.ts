import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

export interface PeriodicElement {
  title: string;
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, title: 'Hydrogen' },
  { position: 2, title: 'Helium' },
  { position: 3, title: 'Lithium' },
  { position: 4, title: 'Beryllium' },
  { position: 5, title: 'Boron' },
  { position: 6, title: 'Carbon' },
  { position: 7, title: 'Nitrogen' },
  { position: 8, title: 'Oxygen' },
  { position: 9, title: 'Fluorine' },
  { position: 10, title: 'Neon' }
];
@Component({
  selector: 'app-d5-questionnaire',
  templateUrl: './d5-questionnaire.component.html',
  styleUrls: ['./d5-questionnaire.component.scss']
})
export class D5QuestionnaireComponent implements OnInit {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'position', 'title', 'check', 'edit'];

  //   dataSource: MatTableDataSource<any>;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selection = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return null;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  /** for table */

  languages: any[] = [
    { value: 'tieng-viet', viewValue: 'Tiếng Việt' },
    { value: 'tieng-anh', viewValue: 'Tiếng Anh' },
    { value: 'tieng-phap', viewValue: 'Tiếng Pháp' }
  ];
  status: any[] = [
    { value: 'tat-ca', viewValue: 'Tất Cả' },
    { value: 'chua-duyet', viewValue: 'Chưa Duyệt' },
    { value: 'da-duyet', viewValue: 'Đã Duyệt' }
  ];
  websites: any[] = [
    { value: 'tat-ca', viewValue: 'Website thông tin trường ĐH Kinh tế Huế' },
    { value: 'chua-duyet', viewValue: 'Khoa Quản trị Kinh doanh' },
    { value: 'da-duyet', viewValue: 'Khoa Kinh tế & Phát triển' },
    { value: 'tat-ca', viewValue: 'Khoa Kế toán - Kiểm toán' },
    { value: 'chua-duyet', viewValue: 'Khoa Kinh tế Chính trị' },
    { value: 'da-duyet', viewValue: 'Phòng Đào Tạo Đại Học' },
    { value: 'tat-ca', viewValue: 'Phòng Đào tạo Sau đại học' },
    { value: 'chua-duyet', viewValue: 'Phòng Kế hoạch - Tài chính' },
    { value: 'da-duyet', viewValue: 'Thư viện' },
    { value: 'tat-ca', viewValue: 'Khoa Hệ thống Thông tin Kinh tế' },
    { value: 'chua-duyet', viewValue: 'Phòng Khảo thí và ĐBCLGD' },
    { value: 'da-duyet', viewValue: 'Phòng Tổ chức - Hành chính' }
  ];
  ngOnInit(): void {}

}
