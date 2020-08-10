import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Advertises_type } from 'src/app/common/models/190advertises_type.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-e1-area-link',
  templateUrl: './e1-area-link.component.html',
  styleUrls: ['./e1-area-link.component.scss']
})
export class E1AreaLinkComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'stt', 'title', 'keyword', 'approved', 'edit'];

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

  // flag insert
  insertFlag: boolean = false;

  advertises_type: Advertises_type;

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
      keyword: [null, [Validators.required, Validators.maxLength(255)]]
    });
  }

  /**
  * ngOnInit
   */
  ngOnInit() {
    // load data combobox websites
    this.loadDataSystemSite();
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
   * loadDataSystemSite
   */
  loadDataSystemSite() {
    const param = {};
    this.subscription.push(this.api.excuteAllByWhat(param, '190').subscribe(data => {
      if (data.length > 0) {
        // set data for table	
        this.dataSource = new MatTableDataSource(data);
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }));
  }

  /**
   * on Insert Click
   */
  onInsertClick() {
    // init value for model
    this.advertises_type = {
      keyword: '',
      title: '',
      approved: false
    };

    this.insertFlag = !this.insertFlag;

    setTimeout(() => {
      window.scroll({ left: 0, top: 1000, behavior: 'smooth' });
    }, 100);
  }

  /**
   * on Update Click
   * @param row 
   */
  onUpdateClick(row) {
    this.advertises_type = row;

    //check approved
    this.advertises_type.approved = this.advertises_type.approved == 0 ? false : true;
    this.insertFlag = true;

    setTimeout(() => {
      window.scroll({ left: 0, top: 1000, behavior: 'smooth' });
    }, 100);
  }

  /**
   * on Delete Click
   */
  onDeleteClick() {
    // get listid selection example: listId='1,2,6'
    let listId = '';
    this.selection.selected.forEach(item => {
      if (listId == '') {
        listId = item.id;
      } else {
        listId += ',' + item.id;
      }
    });

    const param = { "id": listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '193').subscribe(data => {
        // load data grid
        this.loadDataSystemSite();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Xóa thành công');
      }));
    }
    else {
      this.api.showWarning('Vui lòng chọn ít nhất một mục');
    }
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * on Accept Click
   */
  onAcceptClick() {
    // get listid selection example: listId='1,2,6'
    let listId = '';
    this.selection.selected.forEach(item => {
      if (listId == '') {
        listId = item.id;
      } else {
        listId += ',' + item.id;
      }
    });
    const param = { "id": listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '195').subscribe(data => {
        // load data grid
        this.loadDataSystemSite();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Duyệt thành công');
      }));
    } else {
      // check checkbox no check
      this.api.showWarning('Vui lòng chọn ít nhất một mục');
    }
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * on Submit Click
   */
  onSubmitClick() {
    // return if error
    if (this.form.status != 'VALID') {
      this.api.showWarning('Vui lòng nhập các mục đánh dấu *')
      return;
    }

    // check update or insert
    if (this.advertises_type.id == undefined) {
      // update boolean to number
      this.advertises_type.approved = this.advertises_type.approved ? '1' : '0';

      this.subscription.push(this.api.excuteAllByWhat(this.advertises_type, '191').subscribe(data => {
        if (data) {
          // load data grid
          this.loadDataSystemSite();

          // clear forms
          this.form.reset();

          // clear data
          this.onCancelClick();
          this.insertFlag = false;

          // scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });
          this.api.showSuccess('Thêm mới thành công');
        }
      }));
    } else {
      // update boolean to number
      this.advertises_type.approved = this.advertises_type.approved ? '1' : '0';

      this.subscription.push(this.api.excuteAllByWhat(this.advertises_type, '192').subscribe(data => {
        if (data) {
          // load data grid
          this.loadDataSystemSite();

          // clear data
          this.onCancelClick();
          this.insertFlag = false;

          // scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });

          this.api.showSuccess('Cập nhật thành công');
        }
      }));
    }
  }

  /**
   * on Cancel Click
   */
  onCancelClick() {
    this.advertises_type = {
      keyword: '',
      title: '',
      approved: '0',
    };
    
    // clear forms
    this.form.reset();
  }

}
