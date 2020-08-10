import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sys_attributes } from 'src/app/common/models/50sys_attributes.models';

@Component({
  selector: 'app-a5-define-position',
  templateUrl: './a5-define-position.component.html',
  styleUrls: ['./a5-define-position.component.scss']
})
export class A5DefinePositionComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'position', 'id', 'title', 'key', 'edit'];

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
  sys_attributes: Sys_attributes

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
      title: [null, [Validators.required, Validators.maxLength(300)]],
      keyWord: [null, [Validators.required, Validators.maxLength(20)]],
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

    this.api.excuteAllByWhat(param, '50').subscribe(data => {

      if (data.length > 0) {
        // set data for table	
        this.dataSource = new MatTableDataSource(data);

        // defined stt
        let ans = 1;
        data.forEach(item => {
          item.stt = ans;
          ans++;
        });

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
    this.sys_attributes = {
      title: '',
      approved: '0',
      lang: 'vn',
      groupid: '0',
      keyword: '',
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
  onAcceptClick() { }

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
      this.api.excuteAllByWhat(param, '53').subscribe(data => {
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
  onUpdateClick(item) {
    // binding row to form
    this.sys_attributes = item;

    // convert approved before update
    this.sys_attributes.approved = this.sys_attributes.approved == '0' ? 'false' : 'true';

    // open updateFlag
    this.insertFlag = true;

    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' });
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
    if (this.sys_attributes.id == undefined) {
      this.api.excuteAllByWhat(this.sys_attributes, '51').subscribe(data => {
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
          this.api.showSuccess('Thêm mới thành công ');
        }
      });
    } else {
      // update boolean to number
      this.sys_attributes.approved = this.sys_attributes.approved ? '1' : '0';

      this.api.excuteAllByWhat(this.sys_attributes, '52').subscribe(data => {
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
          this.api.showSuccess('Cập nhật thành công ');
        }
      });
    }
  }

  /**
   * on Cance lClick
   */
  onCancelClick() {
    this.sys_attributes = {
      title: '',
      approved: '0',
      lang: this.api.lang,
      groupid: '0',
      keyword: '',
    }

    // clear form
    this.form.reset();
  }

}

