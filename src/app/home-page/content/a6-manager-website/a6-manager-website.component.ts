import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sys_sites } from 'src/app/common/models/60sys_sites.models';


@Component({
  selector: 'app-a6-manager-website',
  templateUrl: './a6-manager-website.component.html',
  styleUrls: ['./a6-manager-website.component.scss']
})
export class A6ManagerWebsiteComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'stt', 'title', 'approved', 'edit'];

  //   dataSource: MatTableDataSource<any>;
  dataSource = new MatTableDataSource<any>();

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

  /** end for table */

  //flag insert
  insertFlag: boolean = false;

  // model binding insert
  sys_sites: Sys_sites;

  // validate
  form: FormGroup;

  /**
   * constructor
   * @param api 
   */
  constructor(private api: ApiService,
    private formBuilder: FormBuilder) {

    // add validate for controls
    this.form = this.formBuilder.group({
      title: [null, [Validators.required, Validators.maxLength(255)]],
      keyWord: [null, [Validators.required, Validators.maxLength(50)]],
      url: [null, [Validators.required, Validators.maxLength(255)]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.onFillterClick();
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach(item => {
      item.unsubscribe();
    });
  }

  /**
  * on Fillter Click
  */
  onFillterClick() {
    const param = {};

    this.api.excuteAllByWhat(param, '60').subscribe(data => {

      if (data.length > 0) {
        // set data for table	
        this.dataSource = new MatTableDataSource(data);
      } else {
        // set data for table	
        this.dataSource = new MatTableDataSource([]);
      }

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selection = new SelectionModel<any>(true, []);
    });
  }

  /**
   * on Insert Click
   */
  onInsertClick() {
    // init value for model
    this.sys_sites = {
      name: '',
      keyword: '',
      url: '',
      approved: false
    }

    // toggle insertFlag
    this.insertFlag = !this.insertFlag;

    //scroll to insertFlag
    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' })
    }, 100);
  }

  /**
   * on Accept Click
   */
  onAcceptClick() {
    // get listid selection example: listId='1,2,6'
    let listId = '';
    this.selection.selected.forEach(item => {
      if (listId == '') {
        listId += item.id
      } else {
        listId += ',' + item.id;
      }
    });

    const param = { 'listid': listId };

    // start update status approved to one
    if (listId !== '') {
      this.api.excuteAllByWhat(param, '67').subscribe(data => {
        // load data grid
        this.onFillterClick();

        //scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });

        // show toast success
        this.api.showSuccess('Duyệt thành công ');
      });
    } else {
      // show toast warning
      this.api.showWarning('Vui lòng chọn 1 mục để duyệt ');
    }

    // clear selected
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * on Delete Click
   */
  onDeleteClick() {
    // get listid selection example: listId='1,2,6'
    let listId = '';
    this.selection.selected.forEach(item => {
      if (listId == '') {
        listId += item.id
      } else {
        listId += ',' + item.id;
      }
    });

    const param = { 'listid': listId }

    // start delete
    if (listId !== '') {
      this.api.excuteAllByWhat(param, '63').subscribe(data => {
        // load data grid
        this.onFillterClick();

        //scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });

        // show toast success
        this.api.showSuccess('Xóa thành công ');
      });
    } else {
      // show toast warning
      this.api.showWarning('Vui lòng chọn 1 mục để xóa ');
    }
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * on Update Click
   */
  onUpdateClick(row) {
    // binding row to form
    this.sys_sites = row;

    // convert approved before update
    this.sys_sites.approved = this.sys_sites.approved == '0' ? false : true;

    // open updateFlag
    this.insertFlag = true;

    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' })
    }, 100)
  }

  /**
   * on Submit Click
   */
  onSubmitClick() {
    // return if error
    if (this.form.status != 'VALID') {
      this.api.showWarning('Vui lòng nhập các mục đánh dấu * ');
      return;
    }

    // check submit or update (insert ko co id update co id)
    if (this.sys_sites.id == undefined) {

      // update boolean to number
      this.sys_sites.approved = this.sys_sites.approved ? '1' : '0';

      this.api.excuteAllByWhat(this.sys_sites, '61').subscribe(data => {
        if (data) {
          // load data grid
          this.onFillterClick();

          // clear data
          this.onCancelClick();

          // close insertFlag
          this.insertFlag = false;

          //scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });

          // clear form
          this.form.reset();

          // show toast success
          this.api.showSuccess('Thêm mới thành công ');
        } else {
          // show toast error
          this.api.showError('Thêm mới thất bại ');
        }
      });
    } else {
      this.api.excuteAllByWhat(this.sys_sites, '62').subscribe(data => {
        if (data) {
          // load data grid
          this.onFillterClick();

          // clear data
          this.onCancelClick();

          // close insertFlag
          this.insertFlag = false;

          //scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });

          // show toast success
          this.api.showSuccess('Cập nhật thành công ');
        }
      });
    }
  }

  /**
   * on Cance lClick
   */
  onCancelClick() {
    this.sys_sites = {
      name: '',
      keyword: '',
      url: '',
      approved: false
    }

    // clear form
    this.form.reset();
  }
}
