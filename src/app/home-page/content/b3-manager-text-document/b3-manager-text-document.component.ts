import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Documents } from 'src/app/common/models/110documents.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';


@Component({
  selector: 'app-b3-manager-text-document',
  templateUrl: './b3-manager-text-document.component.html',
  styleUrls: ['./b3-manager-text-document.component.scss']
})
export class B3ManagerTextDocumentComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'stt', 'title', 'pathfile', 'approved', 'changedate', 'edit'];

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

  //data min date
  minDate = new Date();

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

  // data source for combobox categorys
  categorys: any[] = [];

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
  categoryId: string = '';

  //nameAuthor
  nameAuthor: string = '';

  // flag insert
  insertFlag: boolean = false;

  // model biding insert
  documents: Documents;

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
      postdate: [null, [Validators.required]],
      pathfile: [null],
      content: [null, [Validators.required]]
    });

    this.nameAuthor = this.api.getSysMemberValue.name;
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
    }));
  }

  /**
   * on Combobox Website Change
   * @param isInsert 
   */
  onComboboxWebsiteChange(isInsert) {
    const param = {
      // check siteid run Combobox Website Change with the fist or Insert
      'siteid': isInsert ? this.documents.siteid : this.websiteId,
      'lang': this.api.lang
    }
    this.subscription.push(this.api.excuteAllByWhat(param, '119').subscribe(data => {
      if (data.length > 0) {
        this.categorys = data;

        this.categoryId = data[0].typeid;

        this.categorys.forEach(ele => {
          // check item is childrent
          if (ele.typeid != '0') {
            ele.title = '' + ele.title;
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
      'typeid': this.categoryId
    };

    this.subscription.push(this.api.excuteAllByWhat(param, '117').subscribe(data => {
      console.log(data);
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
    this.documents = {
      typeid: '',
      siteid: '',
      title: '',
      url: '',
      content: '',
      pathfile: '',
      postdate: new Date(),
      changedate: '',
      approved: false,
      author: this.nameAuthor,
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
      this.subscription.push(this.api.excuteAllByWhat(param, '118').subscribe(data => {
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
    this.documents = row;

    //check approved
    this.documents.approved = this.documents.approved == 0 ? false : true;
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

      this.subscription.push(this.api.excuteAllByWhat(param, '113').subscribe(data => {
        // load data grid
        this.onFillterClick();

        // scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
        this.api.showSuccess('Xóa thành công');
      }));

    } else {
      this.api.showWarning('Vui lòng chọn ít nhất một mục!');
    }
    this.selection = new SelectionModel<any>(true, []);
  }

  /**
   * on Submit Click
   */
  onSubmitClick() {
    // return if error
    if (this.form.status != 'VALID') {
      this.api.showWarning('Vui lòng nhập các mục đánh dấu *');
      return;
    }

    // check update or insert
    if (this.documents.id == undefined) {
      // update boolean to number
      this.documents.approved = this.documents.approved ? '1' : '0';

      //changedate
      this.documents.changedate = this.documents.postdate;

      //format Data & add minute
      this.documents.postdate = this.api.formatDate(new Date(this.documents.postdate));
      this.documents.changedate = this.api.formatDate(new Date(this.documents.changedate));

      this.subscription.push(this.api.excuteAllByWhat(this.documents, '111').subscribe(data => {
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
      this.documents.approved = this.documents.approved ? '1' : '0';

      //changedate
      this.documents.changedate = this.documents.postdate;

      //format Data & add minute
      this.documents.postdate = this.api.formatDate(new Date(this.documents.postdate));
      this.documents.changedate = this.api.formatDate(new Date(this.documents.changedate));

      this.subscription.push(this.api.excuteAllByWhat(this.documents, '112').subscribe(data => {
        if (data) {
          // load data grid
          this.onFillterClick();

          // clear data
          this.onCancelClick();
          this.insertFlag = false;

          // scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });

          this.api.showSuccess('Cập nhật thành công!');
        }
      }));
    }
  }

  /**
   * on Cancel Click
   */
  onCancelClick() {
    this.documents = {
      typeid: '',
      siteid: '',
      title: '',
      url: '',
      content: '',
      pathfile: '',
      postdate: new Date(),
      changedate: '',
      approved: false,
      author: this.nameAuthor,
      lang: this.api.lang
    };

    // clear forms
    this.form.reset();
  }

  /**
   * on File Click
   * @param element 
   */
  onFileClick(element) {
    window.open('http://www.hce.edu.vn' + element.pathfile, "_blank");
  }

  /**
   * open Dialog
   * @param element 
   */
  openDialog(element): void {
    const dialogRef = this.dialog.open(ManagerTextDialog, {
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
  async buttonPaste() {
    this.documents.pathfile = (await navigator.clipboard.readText());
  }
}

@Component({
  selector: 'b3-manager-text-document-dialog.component',
  templateUrl: 'b3-manager-text-document-dialog.component.html',
  styleUrls: ['./b3-manager-text-document.component.scss']
})
export class ManagerTextDialog implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  dataInput: any;
  content: any = { content: '' };

  @ViewChild('data', { read: ElementRef, static: true })
  public data: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ManagerTextDialog>,
    @Inject(MAT_DIALOG_DATA) public input: ManagerTextDialog,
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
    this.subscription.push(this.api.excuteAllByWhat(param, '114').subscribe(data => {
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