import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { News } from 'src/app/common/models/100news.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';
@Component({
  selector: 'app-b2-manager-news-notice',
  templateUrl: './b2-manager-news-notice.component.html',
  styleUrls: ['./b2-manager-news-notice.component.scss']
})
export class B2ManagerNewsNoticeComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'title', 'view', 'isfocus', 'approved', 'changedate', 'edit'];

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

  //data min date
  minDate = new Date();

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

  // data source for combobox newwebsites
  newwebsites: any[] = [];

  // data source for combobox categorys
  categorys: any[] = [];

  // data source for combobox arranges
  arranges: any[] = [
    { value: '0', viewValue: 'Mới cập nhật' },
    { value: '1', viewValue: 'Tin nổi bật' },
    { value: '2', viewValue: 'Tin đọc nhiều nhất' }
  ];

  // binding models
  // language
  languageId: string = 'vn';

  // status
  statusId: string = '2';

  // content
  titleId: string = '';

  // website
  websiteId: string = '1';

  // website
  newwebsiteId: string = '1';

  // category
  categoryId: string = '';

  //isnew
  arrangeId: string = '0';

  // flag insert
  insertFlag: boolean = false;

  // model biding insert
  news: News;

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
      lang: [null],
      siteid: [null],
      typeid: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.maxLength(250)]],
      postdate: [null],
      pathimage: [null],
      comment: [null],
      summary: [null],
      content: [null, [Validators.required]]
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
    const param = { siteid: '1' };
    this.subscription.push(this.api.excuteAllByWhat(param, '60').subscribe(data => {
      this.websites = data;

      // on Combobox Website Change the first time
      this.onComboboxWebsiteChange(false);
      this.onFillterClick();
    }));
  }

  /**
   * on Combobox Website Change
   * @param isInsert 
   */
  onComboboxWebsiteChange(isInsert) {
    const param = {
      // check siteid run Combobox Website Change with the fist or Insert
      'siteid': isInsert ? this.news.siteid : this.websiteId,
      'lang': this.api.lang
    }
    this.subscription.push(this.api.excuteAllByWhat(param, '106').subscribe(data => {
      if (data.length > 0) {
        this.categorys = data;
        this.categoryId = data[0].typeid;
        this.categorys.forEach(ele => {
          // check item is childrent
          if (ele.ptypeid != '0') {
            ele.title = ele.title;
          }
        });
      } else {
        this.categorys = [];
        this.categoryId = '';
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
      'siteid': this.websiteId,
      'typeid': this.categoryId,
      'arrange': this.arrangeId
    };

    this.subscription.push(this.api.excuteAllByWhat(param, '107').subscribe(data => {
      if (data.length > 0) {
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
    this.news = {
      typeid: '',
      siteid: '',
      title: '',
      url: '',
      summary: '',
      content: '',
      pathimage: '',
      comment: '',
      postdate: this.api.getDateAndTime,
      changedate: '',
      approved: false,
      author: '',
      lang: this.api.lang,
      isfocus: '',
      isNew: '0',
      view: '1' // đang set mặc định
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
      this.subscription.push(this.api.excuteAllByWhat(param, '108').subscribe(data => {
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
    const param = {
      'id': row.id
    }
    this.subscription.push(this.api.excuteAllByWhat(param, '104').subscribe(data => {
      if (data.length > 0) {
        this.news = data[0];
        this.news.postdate = this.api.getDateAndTime;

        //check approved
        this.news.approved = this.news.approved == 0 ? false : true;
        this.insertFlag = true;
      }

    }));
    this.selection = new SelectionModel<any>(true, []);
    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' });
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

      this.subscription.push(this.api.excuteAllByWhat(param, '103').subscribe(data => {
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
   * on Submit Click
   */
  onSubmitClick() {
    // return if error
    if (this.form.status != 'VALID') {
      this.api.showWarning('Vui lòng nhập các mục đánh dấu *')
      return;
    }

    // check update or insert
    if (this.news.id == undefined) {
      // update boolean to number
      this.news.approved = this.news.approved ? '1' : '0'; 

      //format Data 
      this.news.postdate = this.api.getDateAndTime;
      this.news.changedate = this.api.getDateAndTime;

      this.subscription.push(this.api.excuteAllByWhat(this.news, '101').subscribe(data => {
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
          this.api.showSuccess('Thêm mới thành công');
        }
      }));
    } else {
      // update boolean to number
      this.news.approved = this.news.approved ? '1' : '0'; 

      //format Data 
      this.news.postdate = this.api.getDateAndTime;
      this.news.changedate = this.api.getDateAndTime;

      this.subscription.push(this.api.excuteAllByWhat(this.news, '102').subscribe(data => {
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
    this.news = {
      typeid: '',
      siteid: '',
      title: '',
      url: '',
      summary: '',
      content: '',
      pathimage: '',
      comment: '',
      postdate: this.api.getDateAndTime,
      changedate: '',
      approved: false,
      author: '',
      lang: this.api.lang,
      isfocus: '',
      isNew: '',
      view: ''
    };

    // clear forms
    this.form.reset();
  }

  /**
   * on Focus
   */
  onFocus() {
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
      this.subscription.push(this.api.excuteAllByWhat(param, '109').subscribe(data => {
        // load data grid
        this.onFillterClick();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Chọn tiêu điểm thành công');
      }));
    } else {
      // check checkbox no check
      this.api.showWarning('Vui lòng chọn ít nhất một mục');
    }
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * On Reply Email
   */
  onReplyEmail() {

  }

  /**
   * open Dialog
   * @param element 
   */
  openDialog(element): void {
    const dialogRef = this.dialog.open(ManagerNewsDialog, {
      width: '950px',
      height: '500px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selection = new SelectionModel<any>(true, []);
    });
    
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

  		
/**
   * buttonPaste
   */
  async buttonPaste(){          
    this.news.pathimage = (await navigator.clipboard.readText());       
}
}


@Component({
  selector: 'b2-manager-news-notice-dialog.component',
  templateUrl: 'b2-manager-news-notice-dialog.component.html',
  styleUrls: ['./b2-manager-news-notice.component.scss']
})
export class ManagerNewsDialog implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  dataInput: any;
  content: any = { content: '' };

  @ViewChild('data', { read: ElementRef, static: true })
  public data: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ManagerNewsDialog>,
    @Inject(MAT_DIALOG_DATA) public input: ManagerNewsDialog,
    private api: ApiService) {
    console.log(input);
    this.dataInput = input;
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    const param = {
      'id': this.dataInput.id
    }
    this.subscription.push(this.api.excuteAllByWhat(param, '104').subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        this.content = data[0];

        setTimeout(() => {
          this.content.content = this.data.nativeElement.innerText;
        }, 10);
      }
    }));
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach(item => {
      item.unsubscribe();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

}