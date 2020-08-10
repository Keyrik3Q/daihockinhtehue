import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Feedbacks } from 'src/app/common/models/170feedbacks.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 


@Component({
  selector: 'app-d4-manager-contact-suggest',
  templateUrl: './d4-manager-contact-suggest.component.html',
  styleUrls: ['./d4-manager-contact-suggest.component.scss']
})
export class D4ManagerContactSuggestComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'stt', 'title', 'name', 'reply', 'postdate', 'approved', 'edit'];

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
  contents: any[] = [];

  // binding models
  // language
  languageId: string = 'vn';

  // status
  statusId: string = '2';

  // title
  titleId: string = '';

  // flag insert
  insertFlag: boolean = false;

  // model biding insert
  feedbacks: Feedbacks;

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
      title: [null, [Validators.required, Validators.maxLength(250)]],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(250)]],
      content: [null, [Validators.required]]
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {

    // load data table with fillter header
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
   * loadDataSystemSite
   */
  loadDataSystemSite() {
    const param = {};
    this.subscription.push(this.api.excuteAllByWhat(param, '170').subscribe(data => {
      if (data.length > 0) {
        // set data for table	
        this.dataSource = new MatTableDataSource(data);
        this.onFillterClick();
      } else {
        this.dataSource = new MatTableDataSource([]);
      }

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    };

    this.subscription.push(this.api.excuteAllByWhat(param, '177').subscribe(data => {
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
      this.subscription.push(this.api.excuteAllByWhat(param, '178').subscribe(data => {
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
   * on Reply Click
   * @param row 
   */
  onReply(row) {

    const param = {
      'id': row.id
    }
    this.subscription.push(this.api.excuteAllByWhat(param, '174').subscribe(data => {
      if (data.length > 0) {
        this.feedbacks = data[0];
        this.feedbacks.title = '';
        this.feedbacks.content = '';
        this.feedbacks.reply = '1';
      }
    }));
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

      this.subscription.push(this.api.excuteAllByWhat(param, '173').subscribe(data => {
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
   * on Cancel Click
   */
  onCancelClick() {
    this.feedbacks = {
      email: '',
      title: '',
      content: ''
    };

    // clear forms
    this.form.reset();
  }

  onSendClick() {
    const from = 'support@hoctienganhphanxa.com';
    const to = this.feedbacks.email;
    let subject = this.feedbacks.title;
    let message = this.feedbacks.content;
    this.api.sentMail(from, to, subject, message).subscribe(data => {
     });
     const param = {
      'id': this.feedbacks.id
    }
     this.subscription.push(this.api.excuteAllByWhat(param, '179').subscribe(data => {
       
      this.api.showSuccess('Đã gửi email thành công');
      
    }));
    this.onFillterClick();
    setTimeout(() => {
      window.scroll({ left: 0, top: 270, behavior: 'smooth' });
    }, 100);
   
  }

  /**
   * open Dialog
   * @param element 
   */
  openDialog(element): void {
    const dialogRef = this.dialog.open(ManagerContactSuggestDialog, {
      width: '950px',
      height: '500px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
     
    });
    this.selection = new SelectionModel<any>(true, []);
  }
}

@Component({
  selector: 'd4-manager-contact-suggest-dialog.component',
  templateUrl: 'd4-manager-contact-suggest-dialog.component.html',
  styleUrls: ['./d4-manager-contact-suggest.component.scss']
})
export class ManagerContactSuggestDialog implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  dataInput: any;
  content: any = { content: '' }; 
  feedbackdialogs:any []=[];

  @ViewChild('data', { read: ElementRef, static: true })
  public data: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ManagerContactSuggestDialog>,
    @Inject(MAT_DIALOG_DATA) public input: ManagerContactSuggestDialog,
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
    this.subscription.push(this.api.excuteAllByWhat(param, '174').subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        this.content = data[0];
        this.feedbackdialogs = data;
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