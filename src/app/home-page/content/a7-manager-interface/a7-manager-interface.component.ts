import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/common/api-service/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Sys_templates } from 'src/app/common/models/70sys_templates.models';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-a7-manager-interface',
  templateUrl: './a7-manager-interface.component.html',
  styleUrls: ['./a7-manager-interface.component.scss']
})
export class A7ManagerInterfaceComponent implements OnInit, OnDestroy {
  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['radio', 'stt', 'name', 'status', 'illustration', 'folder', 'edit'];

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
  // data source for combobox websites
  websites: any[] = [];

  // bindding models
  //website
  websiteId: string = '';

  //flag insert
  insertFlag: boolean = false;

  // item had choosen listfilter
  isChoose: any[];

  sys_templates: Sys_templates;
  last_sys_templates: Sys_templates;

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
      title: [null, [Validators.required, Validators.maxLength(255)]],
      website: [null],
      folder: [null, [Validators.required, Validators.maxLength(50)]],
      image: [null, [Validators.required, Validators.maxLength(255)]],
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
    this.api.excuteAllByWhat(param, '60').subscribe(data => {
      if (data) {
        this.websites = data;

        // set first select websites combobox
        this.websiteId = this.websites[0].id;

        this.onFillterClick();
      }
    });
  }

  /**
   * on Fillter Click, data depend on id website
   */
  onFillterClick() {
    const param = { 'siteid': this.websiteId };

    this.api.excuteAllByWhat(param, '74').subscribe(data => {
      if (data.length > 0) {

        // set data for table	
        this.dataSource = new MatTableDataSource(data);
        data.forEach(item => {

          // assign isChoose
          if (item.approved == 1) {
            this.isChoose = item;
            this.last_sys_templates = item;
          }
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
    this.sys_templates = {
      siteid: '1',
      title: '',
      folder: '',
      imagepath: '',
      approved: '0',
    }

    // toggle insertFlag
    this.insertFlag = !this.insertFlag;

    //scroll to insertFlag
    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' });
    }, 100);
  }

  /**
   * on Accept Click
   */
  onAcceptClick() {
    const param = { 'listid': this.last_sys_templates['id'] + ',' + this.isChoose['id'] };

    // start update status approved to one
    if (this.last_sys_templates['id'] !== this.isChoose['id']) {

      // set approve
      this.api.excuteAllByWhat(param, '78').subscribe(data => {

        // load data grid
        this.onFillterClick();

        //scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });

        // show toast success
        this.api.showSuccess('Chọn giao diện thành công ');
      });

    } else {
      this.api.showWarning('Giao diện này đang chọn ');
    }
  }

  /**
   * on Radio Click
   * @param element 
   */
  onRadioClick(element) {
    this.last_sys_templates = element;
  }

  /**
   * on Delete Click
   */
  onDeleteClick() {

    let listId = this.last_sys_templates;

    const param = { 'listid': listId['id'] };

    // start delete item
    if (listId !== '') {
      if (this.last_sys_templates.approved == 0) {

        this.api.excuteAllByWhat(param, '73').subscribe(data => {
          // load data grid
          this.onFillterClick();

          //scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });

          // clear form
          this.form.reset();

          // show toast success
          this.api.showSuccess('Xóa thành công ');
        });
      } else {
        // show toast warning
        this.api.showWarning('Giao diện này đang được chọn không thể xóa ');
      }
    } else {
      // show toast warning
      this.api.showWarning('Vui lòng chọn 1 mục để xóa ');
    }
  }

  /**
   * on Update Click
   */
  onUpdateClick(element) {
    // binding row to form
    this.sys_templates = element;

    // format approved
    this.sys_templates.approved = this.sys_templates.approved == 0 ? false : true;

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
    if (this.sys_templates.id == undefined) {
      this.api.excuteAllByWhat(this.sys_templates, '71').subscribe(data => {
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
          this.api.showSuccess('Thêm thành công ');
        }
      });
    } else {

      this.api.excuteAllByWhat(this.sys_templates, '72').subscribe(data => {
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
    this.sys_templates = {
      siteid: '1',
      title: '',
      folder: '',
      imagepath: '',
      approved: '0',
    }

    // clear form
    this.form.reset();
  }

  /**
   * buttonPaste
   */
  async buttonPaste() {
    this.sys_templates.imagepath = (await navigator.clipboard.readText());
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
}
