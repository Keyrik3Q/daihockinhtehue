import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Advertises } from 'src/app/common/models/200advertises.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';
import { MatDialog } from '@angular/material/dialog'; 

@Component({
  selector: 'app-e2-link',
  templateUrl: './e2-link.component.html',
  styleUrls: ['./e2-link.component.scss']
})

export class E2LinkComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'stt', 'pathimage', 'title', 'approved', 'arrange', 'edit'];

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

  // data source for combobox websites
  websites: any[] = [];

  // data source for combobox NoAllwebsites
  NoAllwebsites: any[] = [];

  // data arrange
  arrange: any[] = [];

  // data position
  positions: any[] = [];

  // data pathimage
  pathimage: any[] = [];

  // binding models
  // language
  languageId: string = 'vn';

  // status
  statusId: string = '2';

  // website
  websiteId: string = '';

  //  position
  positionId: string = '';

  //maxArrange
  maxArrange: number;

  // flag insert
  insertFlag: boolean = false;

  // model biding insert
  advertises: Advertises;

  // validate
  form: FormGroup;

  /**
     * constructor
     * @param api 
     */
  constructor(private api: ApiService,
    private formBuilder: FormBuilder, public dialog: MatDialog) {
    // add validate for controls
    this.form = this.formBuilder.group({
      arrange: [null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(11)]],
      lang: [null],
      siteid: [null],
      title: [null, [Validators.required, Validators.maxLength(255)]],
      link: [null, [Validators.required]],
      pathimage: [null, [Validators.required]],
      position: [null]
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
    this.subscription.push(this.api.excuteAllByWhat(param, '60').subscribe(data => {
      this.NoAllwebsites = data;

      //add value Website
      if (data.length > 0) {
        let temp = [
          {
            id: "0",
            name: "Tất Cả"
          }
        ];

        data.forEach(item => {
          temp.push(item);
        });

        this.websites = temp;
        // set first select websites combobox
        this.websiteId = this.websites[0].id;
        this.onFillterClick();
      }
    }));
  }

  /**
    * on Fillter Click
    */
  onFillterClick() {
    const param = {
      'siteid': this.websiteId,
      'approved': this.statusId,
      lang: this.api.lang
    };

    this.subscription.push(this.api.excuteAllByWhat(param, '205').subscribe(data => {
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        // set data for table	
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }));
  }

  /**
    * on Insert Click
    */
  onInsertClick() {

    // load data postion
    const param = {};
    this.subscription.push(this.api.excuteAllByWhat(param, '190').subscribe(data => {
      this.positions = data;
    }));

    // init value for model
    this.advertises = {
      siteid: '',
      title: '',
      pathimage: '',
      position: '1',
      arrange: '' + (this.maxArrange + 1),
      approved: false,
      link: '',
      lang: this.api.lang
    };

    this.insertFlag = !this.insertFlag;

    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' });
    }, 100);

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

    const param = { "id": listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '203').subscribe(data => {
        // load data grid
        this.onFillterClick();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Xóa thành công');
      }));

    } else {
      this.api.showWarning('Vui lòng chọn ít nhất một mục');
    }
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * on Arrange Click
   */
  onArrangeClick() {
    // get listid selection example: listId='1,2,6'
    let listId = '';
    this.selection.selected.forEach(item => {
      if (listId == '') {
        listId = item.id;
      } else {
        listId += ',' + item.id;
      }
      item.pathimage = item.pathimage;
    });
    const param = { "id": listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '208').subscribe(data => {
        // load data grid
        this.onFillterClick();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Sắp xếp thành công');
      }));
    } else {
      // check checkbox no check
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
      item.pathimage = item.pathimage;
    });
    const param = { "id": listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '207').subscribe(data => {
        // load data grid
        this.onFillterClick();

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
   * on Update Click
   * @param row 
   */
  onUpdateClick(row) {

    // load data postion
    const param = {};
    this.subscription.push(this.api.excuteAllByWhat(param, '190').subscribe(data => {
      this.positions = data;
    }));

    this.advertises = row;
    // check approved
    this.advertises.approved = this.advertises.approved == 0 ? false : true;
    this.insertFlag = true;

    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' });
    }, 100);
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
    if (this.advertises.id == undefined) {
      // update boolean to number
      this.advertises.approved = this.advertises.approved ? '1' : '0';
      this.advertises.pathimage = this.advertises.pathimage;

      this.subscription.push(this.api.excuteAllByWhat(this.advertises, '201').subscribe(data => {
        if (data) {
          // load data grid
          this.onFillterClick();

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
      this.advertises.approved = this.advertises.approved ? '1' : '0';
      this.subscription.push(this.api.excuteAllByWhat(this.advertises, '202').subscribe(data => {
        if (data) {
          // load data grid
          this.onFillterClick();

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
    this.advertises = {
      siteid: '',
      title: '',
      pathimage: '',
      position: '1',
      arrange: '',
      approved: false,
      link: '',
      lang: this.api.lang
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
    this.subscription.push(this.api.excuteAllByWhat(row, '202').subscribe(data => {
      if (data) {
        // load data grid
        this.onFillterClick();

        this.api.showSuccess('Cập nhật thành công');
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

  /**
   * buttonPaste
   */
  async buttonPaste(){          
      this.advertises.pathimage = (await navigator.clipboard.readText());       
  }

  // open dialog for choosing file
  openDialogChoosefile(): void {
    const dialogRef = this.dialog.open(GManageFileComponent, {
      width: '100%',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  

}

