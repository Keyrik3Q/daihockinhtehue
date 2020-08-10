import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Weblink } from 'src/app/common/models/160weblink.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-d3-link-website',
  templateUrl: './d3-link-website.component.html',
  styleUrls: ['./d3-link-website.component.scss']
})
export class D3LinkWebsiteComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'stt', 'title', 'link', 'approved', 'arrange', 'edit'];

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
  titleId: string = '';

  // website
  websiteId: string = '';

  //maxArrange
  maxArrange: number;

  // flag insert
  insertFlag: boolean = false;

  // model biding insert
  weblink: Weblink;


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
      arrange: [null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(11)]],
      lang: [null],
      siteid: [null],
      title: [null, [Validators.required, Validators.maxLength(250)]],
      link: [null, [Validators.required, Validators.maxLength(250)]],
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
      console.log(data);
      this.NoAllwebsites = data;

      // add value Website
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
      'approved': this.statusId,
      'lang': this.api.lang,
      'title': this.titleId.trim(),
      'siteid': this.websiteId
    };

    this.subscription.push(this.api.excuteAllByWhat(param, '167').subscribe(data => {
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
    // init value for model
    this.weblink = {
      title: '',
      siteid: '1',
      link: '',
      approved: false,
      arrange: '' + (this.maxArrange + 1),
      lang: this.api.lang
    };

    this.insertFlag = !this.insertFlag;

    setTimeout(() => {
      window.scroll({ left: 0, top: 1000, behavior: 'smooth' });
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
        listId = item.id;
      } else {
        listId += ',' + item.id;
      }
    });
    const param = { "id": listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '165').subscribe(data => {
        // load data grid
        this.onFillterClick();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Duyệt thành công!');
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
    this.weblink = row;
    //check approved
    this.weblink.approved = this.weblink.approved == 0 ? false : true;
    this.insertFlag = true;

    setTimeout(() => {
      window.scroll({ left: 0, top: 1000, behavior: 'smooth' });
    }, 100);
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
    });
    const param = { "id": listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '168').subscribe(data => {
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
      this.subscription.push(this.api.excuteAllByWhat(param, '163').subscribe(data => {
        // load data grid
        this.onFillterClick();

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
   * on Submit Click
   */
  onSubmitClick() {
    // return if error
    if (this.form.status != 'VALID') {
      this.api.showWarning('Vui lòng nhập các mục đánh dấu *')
      return;
    }

    // check update or insert
    if (this.weblink.id == undefined) {
      // update boolean to number
      this.weblink.approved = this.weblink.approved ? '1' : '0';

      this.subscription.push(this.api.excuteAllByWhat(this.weblink, '161').subscribe(data => {
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
          this.api.showSuccess('Thêm mới thành công!');
        }
      }));
    } else {
      // update boolean to number
      this.weblink.approved = this.weblink.approved ? '1' : '0';

      this.subscription.push(this.api.excuteAllByWhat(this.weblink, '162').subscribe(data => {
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
    this.weblink = {
      title: '',
      siteid: '1',
      link: '',
      approved: false,
      arrange: '',
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
    this.subscription.push(this.api.excuteAllByWhat(row, '162').subscribe(data => {
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
}

