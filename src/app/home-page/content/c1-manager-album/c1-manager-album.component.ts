import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Album } from 'src/app/common/models/120album.models';
import { MatDialog } from '@angular/material/dialog';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-c1-manager-album',
  templateUrl: './c1-manager-album.component.html',
  styleUrls: ['./c1-manager-album.component.scss']
})
export class C1ManagerAlbumComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'image', 'album', 'check', 'sort', 'edit'];

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

  /** for table */

  // data for fillter
  // data source for combobox language
  languages: any[] = [
    { value: 'vn', viewValue: 'Tiếng Việt' },
    { value: 'en', viewValue: 'Tiếng Anh' },
    { value: 'fr', viewValue: 'Tiếng Pháp' }
  ];

  // data source for combobox status
  status: any[] = [
    { value: '2', viewValue: 'Tất Cả' },
    { value: '0', viewValue: 'Chưa Duyệt' },
    { value: '1', viewValue: 'Đã Duyệt' }
  ];

  // data data source for combobox content
  titles: any[] = [];

  // data source for combobox websites
  websites: any[] = [];

  // data source for combobox NoAllwebsites
  NoAllwebsites: any[] = [];

  // binding models
  // language
  languageId: string = 'vn';

  // status
  statusId: string = '2';

  // content
  titleBox: string = '';

  // website
  websiteId: string = '1';

  // flag insert
  insertFlag: boolean = false;

  // model biding insert
  album: Album;

  // define maxArrange insert
  maxArrange: number;

  // validate
  form: FormGroup;

  /**
  * constructor
  * @param api 
  */
  constructor(private api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) {
    // add validate for controls
    this.form = this.formBuilder.group({
      arrange: [null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(11)]],
      lang: [null],
      siteid: [null],
      title: [null, [Validators.required, Validators.maxLength(250)]],
      pathimage: [null, [Validators.required]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // load data table with fillter header
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
    this.subscription.push(this.api.excuteAllByWhat(param, '60').subscribe(data => {

      if (data.length > 0) {
        // asign websites equal data
        this.websites = data;

        this.onFillterClick();
      }
    }));
  }

  /**
   * on Fillter Click
   */
  onFillterClick() {
    const param = {
      'approved': this.statusId,
      'lang': this.api.lang,
      'title': this.titleBox.trim(),
      'siteid': this.websiteId
    };

    this.subscription.push(this.api.excuteAllByWhat(param, '127').subscribe(data => {
      if (data.length > 0) {
        // get max arrange
        this.maxArrange = -999;
        data.forEach(item => {
          if (Number(item.arrange) > this.maxArrange) {
            this.maxArrange = Number(item.arrange);
          }
        });

        // set data for table
        this.dataSource = new MatTableDataSource(data);
      } else {
        this.dataSource = new MatTableDataSource([]);
      }

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selection = new SelectionModel<any>(true, []);
    }));
  }

  /**
   * on Insert Click
   */
  onInsertClick() {
    this.album = {
      siteid: '1',
      title: '',
      arrange: '' + (this.maxArrange + 1),
      approved: false,
      lang: 'vn',
      pathimage: '',
      description: null,
      postdate: null,
    };

    this.insertFlag = !this.insertFlag;

    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' });
    }, 100);
  }

  /**
   * on Accept Click
   */
  onAcceptClick() {
    let listId = '';
    this.selection.selected.forEach(item => {
      if (listId == '') {
        listId = item.id;
      } else {
        listId += ',' + item.id;
      }
    });

    const param = { 'listid': listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '128').subscribe(data => {
        // load data grid
        this.onFillterClick();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Duyệt thành công ');
      }));
    } else {
      // check checkbox no check
      this.api.showWarning('Vui lòng chọn ít nhất một mục để duyệt ');
    }
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * on Update Click
   */
  onUpdateClick(element) {
    this.album = element;
    // format approved
    this.album.approved = this.album.approved == 0 ? false : true;
    this.insertFlag = true;

    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' });
    }, 100);
  }

  /**
   * on Arrange Click
   */
  onArrangeClick() {
    let listId = '';
    this.selection.selected.forEach(item => {
      if (listId == '') {
        listId = item.id;
      } else {
        listId += ',' + item.id;
      }
    });
    const param = { 'listid': listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '129').subscribe(data => {
        // load data grid
        this.onFillterClick();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Sắp xếp thành công ');
      }));
    } else {
      // check checkbox no check
      this.api.showWarning('Vui lòng chọn ít nhất một mục để sắp xếp ');
    }
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * on Delete Click
   */
  onDeleteClick() {
    let listId = '';
    this.selection.selected.forEach(item => {
      if (listId == '') {
        listId = item.id;
      } else {
        listId += ',' + item.id;
      }
    });

    const param = { 'listid': listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '123').subscribe(data => {
        // load data grid
        this.onFillterClick();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Xóa thành công ');
      }));
    } else {
      this.api.showWarning('Vui lòng chọn ít nhất một mục để xóa ');
    }
    this.selection = new SelectionModel<any>(true, []);
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

    // check update or insert
    if (this.album.id == undefined) {
      // update boolean to number
      this.album.approved = this.album.approved ? '1' : '0';

      this.subscription.push(this.api.excuteAllByWhat(this.album, '121').subscribe(data => {
        if (data) {
          // load data grid
          this.onFillterClick();

          // clear data
          this.onCancelClick();
          this.insertFlag = false;

          // clear forms
          this.form.reset();

          // scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });
          this.api.showSuccess('Thêm mới thành công ');
        }
      }));
    } else {
      // update boolean to number
      this.album.approved = this.album.approved ? '1' : '0';

      this.subscription.push(this.api.excuteAllByWhat(this.album, '122').subscribe(data => {
        if (data) {
          // load data grid
          this.onFillterClick();

          // clear data
          this.onCancelClick();
          this.insertFlag = false;

          // scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });

          this.api.showSuccess('Cập nhật thành công ');
        }
      }));
    }
  }

  /**
   * on Cancel Click
   */
  onCancelClick() {
    this.album = {
      siteid: '1',
      title: '',
      arrange: '',
      approved: false,
      lang: this.api.lang,
      pathimage: '',
      description: null,
      postdate: null,
    };

    // clear forms
    this.form.reset();
  }

  /**
     * onFocusoutArrange
     * @param row 
     * @param event 
     */
  onFocusoutArrange(row, event) {
    row.arrange = event.srcElement.value
    this.subscription.push(this.api.excuteAllByWhat(row, '122').subscribe(data => {
      if (data) {
        // load data grid
        this.onFillterClick();

        this.api.showSuccess('Cập nhật thành công!');
      }
    }));
  }

  /**
   * numberOnly
   * @param event 
   */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  // open dialog
  openDialogChoosefile(): void {
    const dialogRef = this.dialog.open(GManageFileComponent, {
      width: '100%',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /**
   * buttonPaste
   */
  async buttonPaste() {
    this.album.pathimage = (await navigator.clipboard.readText());
  }
}
