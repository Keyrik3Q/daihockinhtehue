import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Sys_banner } from 'src/app/common/models/80sys_banner.models';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-a8-manager-banner',
  templateUrl: './a8-manager-banner.component.html',
  styleUrls: ['./a8-manager-banner.component.scss']
})
export class A8ManagerBannerComponent implements OnInit, OnDestroy {

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'position', 'image', 'nameLink', 'check', 'sort', 'edit'];

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

  // binding models
  // language
  languageId: string = 'vn';

  // status
  statusId: string = '2';

  // website
  websiteId: string = '';

  // flag insert
  insertFlag: boolean = false;

  // website Not All
  websiteNotAll: any[];

  // model biding insert
  sys_banner: Sys_banner;

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
      website: [null],
      nameLink: [null, [Validators.required, Validators.maxLength(255)]],
      image: [null, [Validators.required, Validators.maxLength(255)]],
      addressLink: [null, [Validators.maxLength(255)]],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // load data combobox websites
    this.onLoadDataWebsites();
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
   * on Load All Websites
   */
  onLoadDataWebsites() {
    const param = {};
    this.subscription.push(this.api.excuteAllByWhat(param, '60').subscribe(data => {

      if (data.length > 0) {
        // website Not All
        this.websiteNotAll = data;

        let temp = [
          {
            id: '0',
            name: 'Tất Cả'
          }
        ];

        // push tat-ca in websites
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
   * on Fillter Click, data depend on id website
   */
  onFillterClick() {
    const param = {
      'siteid': this.websiteId,
      'approved': this.statusId,
      'lang': this.api.lang
    };

    this.subscription.push(this.api.excuteAllByWhat(param, '87').subscribe(data => {

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

        // define stt
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
    }));
  }

  /**
   * on Insert Click
   */
  onInsertClick() {
    // init value for model
    this.sys_banner = {
      siteid: '1',
      title: '',
      link: '',
      arrange: '' + (this.maxArrange + 1),
      approved: false,
      lang: 'vn',
      pathimage: '',
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

    const param = { 'listid': listId }

    // start update status approved to one
    if (listId !== '') {
      this.api.excuteAllByWhat(param, '89').subscribe(data => {
        // load data grid
        this.onFillterClick();

        //scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });

        // show toast success
        this.api.showSuccess('Duyệt thành công ')
      });
    } else {
      // show toast warning
      this.api.showWarning('Vui lòng chọn 1 mục để duyệt ')
    }
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

    // start update status approved to one
    if (listId !== '') {
      this.api.excuteAllByWhat(param, '83').subscribe(data => {
        // load data grid
        this.onFillterClick();

        //scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });

        // show toast success
        this.api.showSuccess('Xóa thành công ')
      });
    } else {
      // show toast warning
      this.api.showWarning('Vui lòng chọn 1 mục để xóa ')
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
    const param = { 'id': listId };

    // start update status approved to one
    if (listId != '') {
      this.subscription.push(this.api.excuteAllByWhat(param, '84').subscribe(data => {
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
   * on Update Click
   */
  onUpdateClick(element) {
    // binding row to form
    this.sys_banner = element;

    // format approved
    this.sys_banner.approved = this.sys_banner.approved == '0' ? false : true;

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
    if (this.sys_banner.id == undefined) {

      // update boolean to number
      this.sys_banner.approved = this.sys_banner.approved ? '1' : '0';

      this.api.excuteAllByWhat(this.sys_banner, '81').subscribe(data => {
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
          this.api.showSuccess('Thêm thành công ');
        }
      });
    } else {

      this.api.excuteAllByWhat(this.sys_banner, '82').subscribe(data => {
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
    this.sys_banner = {
      siteid: '1',
      title: '',
      link: '',
      arrange: '',
      approved: false,
      lang: this.api.lang,
      pathimage: '',
    }

    // clear form
    this.form.reset();
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
     * onFocusoutArrange
     * @param row 
     * @param event 
     */
  onFocusoutArrange(row, event) {
    row.arrange = event.srcElement.value
    this.subscription.push(this.api.excuteAllByWhat(row, '82').subscribe(data => {
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

  		
/**
   * buttonPaste
   */
  async buttonPaste(){          
    this.sys_banner.pathimage = (await navigator.clipboard.readText());       
}

}
