import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/common/api-service/api.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/common/validations/must-match.validator';
import { Sys_member } from 'src/app/common/models/40sys_member.models';
import { Md5 } from 'ts-md5';

export interface DialogData {

}

@Component({
  selector: 'app-a4-manager-member',
  templateUrl: './a4-manager-member.component.html',
  styleUrls: ['./a4-manager-member.component.scss']
})
export class A4ManagerMemberComponent implements OnInit, OnDestroy {

  rfContact: FormGroup;

  /** for table */
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['select', 'stt', 'user', 'role', 'approved', 'edit'];

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
  
  // data source for combobox websites
  websites: any[] = [];

  //data password
  passwordOld: string;
  passwordMd5: string='';

  // bindding models
  //website
  websiteId: string = '';

  //flag insert
  insertFlag: boolean = false;

  // website Not All
  websiteNotAll: any[];

  // model binding insert
  sys_member: Sys_member;

  // validate
  form: FormGroup;

  //confirmPassword for validator match with password
  confirmPassword: any;

  /**
   * constructor
   * @param api 
   */
  constructor(private api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { 
    // add validate for controls
    this.form = this.formBuilder.group({
      website: [null, [Validators.required]],
      user: [null, [Validators.required, Validators.maxLength(255)]],
      userName: [null, [Validators.required, Validators.maxLength(50)]],
      password: [null, [Validators.required, Validators.maxLength(50)]],
      confirmPassword: [null, Validators.required,],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(255)]]
    },
      { validator: MustMatch('password', 'confirmPassword') }
    );
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
   * on Load Data Websites
   */
  onLoadDataWebsites() {
    const param = {};
    this.api.excuteAllByWhat(param, '60').subscribe(data => {
      if (data) {
        this.websiteNotAll = data;
        let temp = [
          {
            id: '0',
            name: 'Tất Cả'
          }
        ];

        this.websites = data;
        data.forEach(item => {
          temp.push(item);
        });
        this.websites = temp;

        // set first select websites combobox
        this.websiteId = this.websites[0].id;
        this.onFillterClick();
      }
    });
  }

  /**
   * on Fillter Click
   */
  onFillterClick() {
    const param = { 'siteid': this.websiteId };

    this.api.excuteAllByWhat(param, '44').subscribe(data => {
      if (data.length > 0) {
        // set data for table	
        this.dataSource = new MatTableDataSource(data);

        // binding stt
        let count = 1;
        data.forEach(item => {
          item.stt = count;
          count++;
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
    this.sys_member = {
      maphongban: '0',
      manhom: '0',
      kyvanban: '',
      name: '',
      siteid: '1',
      password: '',
      username: '',
      postdate: null,
      level: '1',
      approved: false,
      permission: '',
      email: '',
    }

    // toggle insertFlag
    this.insertFlag = !this.insertFlag;

    //scroll to insertFlag
    setTimeout(() => {
      window.scroll({ left: 0, top: 10000, behavior: 'smooth' })
    }, 100)
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
      this.api.excuteAllByWhat(param, '45').subscribe(data => {
        // load data grid
        this.onFillterClick();

        //scroll top
        window.scroll({ left: 0, top: 0, behavior: 'smooth' });

        // show toast success
        this.api.showSuccess('Duyệt thành công ');
      });
    } else {
      // show toast warning
      this.api.showWarning('Vui lòng chọn 1 mục để duyệt ')
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
        listId += item.id
      } else {
        listId += ',' + item.id;
      }
    });

    const param = { 'listid': listId }

    // start update status approved to one
    if (listId !== '') {
      this.api.excuteAllByWhat(param, '43').subscribe(data => {
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
  onUpdateClick(row) {
    // binding row to form
    this.sys_member = row;

    // convert approved before update 
    this.sys_member.approved = this.sys_member.approved == '0' ? false : true

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
    this.sys_member.password = Md5.hashStr(this.passwordMd5).toString();
    // check submit or update (insert ko co id update co id)
    if (this.sys_member.id == undefined) {

      // update boolean to number
      this.sys_member.approved = this.sys_member.approved ? '1' : '0';
      this.sys_member.maphongban = this.sys_member.siteid;

      this.api.excuteAllByWhat(this.sys_member, '41').subscribe(data => {
        if (data) {
          // load data grid
          this.onFillterClick();

          // clear data
          this.onCancelClick();

          //close flag
          this.insertFlag = false;

          //scroll top
          window.scroll({ left: 0, top: 0, behavior: 'smooth' });

          // clear form
          this.form.reset();

          // show toast success
          this.api.showSuccess('Thêm mới thành viên thành công ');

        } else {
          // show toast error
          this.api.showError('Thêm thành viên thất bại ');
        }
      });
    } else {
      // update boolean to number
      this.sys_member.approved = this.sys_member.approved ? '1' : '0';

      // this.sys_member is data prepare update
      this.api.excuteAllByWhat(this.sys_member, '42').subscribe(data => {
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
          this.api.showSuccess('Cập nhật thành viên thành công ');
        }
      });
    }
  }

  /**
   * on Cance lClick
   */
  onCancelClick() {
    this.sys_member = {
      maphongban: '0',
      manhom: '0',
      kyvanban: '',
      name: '',
      siteid: '1',
      password: '',
      username: '',
      postdate: null,
      approved: false,
      level: '1',
      permission: null,
      email: '',
    }

    // clear form
    this.form.reset();
  }

  openPermission(element): void {
    const dialogRef = this.dialog.open(ManagerMemberDialog, {
      width: '600px',
      height: '600px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}

@Component({
  selector: 'a4-manager-member-dialog',
  templateUrl: './a4-manager-member-dialog.component.html',
  styleUrls: ['./a4-manager-member.component.scss']
})
export class ManagerMemberDialog {
  subscription: Subscription[] = [];

  //sys_sites
  site: boolean = false;
  site1: boolean = false;
  site2: boolean = false;
  site3: boolean = false;
  site4: boolean = false;
  site5: boolean = false;
  site6: boolean = false;
  site7: boolean = false;
  site8: boolean = false;
  site9: boolean = false;
  site10: boolean = false;
  site11: boolean = false;
  site12: boolean = false;
  site13: boolean = false;
  site14: boolean = false;
  site15: boolean = false;
  site16: boolean = false;
  site17: boolean = false;
  site18: boolean = false;
  site19: boolean = false;
  site20: boolean = false;
  site21: boolean = false;
  site22: boolean = false;
  site23: boolean = false;

  //sys permissions
  permission1: boolean = false;
  permission2: boolean = false;
  permission3: boolean = false;
  permission4: boolean = false;
  permission5: boolean = false;
  permission6: boolean = false;
  permission7: boolean = false;
  permission8: boolean = false;
  permission9: boolean = false;
  permission10: boolean = false;
  permission11: boolean = false;
  permission12: boolean = false;
  permission13: boolean = false;
  permission14: boolean = false;
  permission15: boolean = false;
  permission16: boolean = false;
  permission17: boolean = false;
  permission18: boolean = false;
  permission19: boolean = false;
  permission20: boolean = false;
  permission21: boolean = false;
  permission22: boolean = false;

  onCheckSystem: boolean = false;
  onCheckImage: boolean = false;
  onCheckinCalendar: boolean = false;
  onCheckinChange: boolean = false;
  onCheckinFormation: boolean = false;


  // data source for dialog websites
  //all website
  websites: any[] = [];

  // all cate
  categories: any[] = [];

  // list id siteid of
  listSiteId: string;

  // list id cate of
  listCateId: string;

  // id selected
  id: any;

  selection = new SelectionModel<any>(true, []);


  constructor(
    public dialogRef: MatDialogRef<ManagerMemberDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private api: ApiService
  ) {
  }

  /**
     * ngOnInit
     */
  ngOnInit() {

    this.onCheckPermission();

    // // load data cate
    // this.onLoadDataCategories();
  }

  onCheckPermission() {
    const param = {
      'id': this.data['id']
    }
    // checked siteid
    this.subscription.push(this.api.excuteAllByWhat(param, '47').subscribe(data => {

      if (data.length > 0) {
        this.sysmember = data[0];
        // load data sys sites

        if (data[0].siteid.search('1') >= 0) {
          this.site1 = true;
        }
        if (data[0].siteid.search('2') >= 0) {
          this.site2 = true;
        }
        if (data[0].siteid.search('3') >= 0) {
          this.site3 = true;
        }
        if (data[0].siteid.search('4') >= 0) {
          this.site4 = true;
        }
        if (data[0].siteid.search('5') >= 0) {
          this.site5 = true;
        }
        if (data[0].siteid.search('6') >= 0) {
          this.site6 = true;
        }
        if (data[0].siteid.search('7') >= 0) {
          this.site7 = true;
        }
        if (data[0].siteid.search('8') >= 0) {
          this.site8 = true;
        }
        if (data[0].siteid.search('9') >= 0) {
          this.site9 = true;
        }
        if (data[0].siteid.search('9') >= 0) {
          this.site9 = true;
        }
        if (data[0].siteid.search('10') >= 0) {
          this.site10 = true;
        }
        if (data[0].siteid.search('11') >= 0) {
          this.site11 = true;
        }
        if (data[0].siteid.search('12') >= 0) {
          this.site12 = true;
        }
        if (data[0].siteid.search('13') >= 0) {
          this.site13 = true;
        }
        if (data[0].siteid.search('14') >= 0) {
          this.site14 = true;
        }
        if (data[0].siteid.search('15') >= 0) {
          this.site15 = true;
        }
        if (data[0].siteid.search('16') >= 0) {
          this.site16 = true;
        }
        if (data[0].siteid.search('17') >= 0) {
          this.site17 = true;
        }
        if (data[0].siteid.search('18') >= 0) {
          this.site18 = true;
        }
        if (data[0].siteid.search('19') >= 0) {
          this.site19 = true;
        }
        if (data[0].siteid.search('20') >= 0) {
          this.site20 = true;
        }
        if (data[0].siteid.search('21') >= 0) {
          this.site21 = true;
        }
        if (data[0].siteid.search('22') >= 0) {
          this.site22 = true;
        }
        if (data[0].siteid.search('23') >= 0) {
          this.site23 = true;
        }

        if (data[0].permission.search('2') >= 0) {
          this.permission1 = true;
        }
        if (data[0].permission.search('3') >= 0) {
          this.permission2 = true;
        }
        if (data[0].permission.search('4') >= 0) {
          this.permission3 = true;
        }
        if (data[0].permission.search('17') >= 0) {
          this.permission4 = true;
        }
        if (data[0].permission.search('38') >= 0) {
          this.permission5 = true;
        }
        if (data[0].permission.search('39') >= 0) {
          this.permission6 = true;
        }
        if (data[0].permission.search('54') >= 0) {
          this.permission7 = true;
        }
        if (data[0].permission.search('61') >= 0) {
          this.permission8 = true;
        }
        if (data[0].permission.search('65') >= 0) {
          this.permission9 = true;
        }
        if (data[0].permission.search('67') >= 0) {
          this.permission10 = true;
        }
        if (data[0].permission.search('69') >= 0) {
          this.permission11 = true;
        }
        if (data[0].permission.search('71') >= 0) {
          this.permission12 = true;
        }
        if (data[0].permission.search('72') >= 0) {
          this.permission13 = true;
        }
        if (data[0].permission.search('79') >= 0) {
          this.permission14 = true;
        }
        if (data[0].permission.search('80') >= 0) {
          this.permission15 = true;
        }
        if (data[0].permission.search('86') >= 0) {
          this.permission16 = true;
        }
        if (data[0].permission.search('87') >= 0) {
          this.permission17 = true;
        }
        if (data[0].permission.search('94') >= 0) {
          this.permission18 = true;
        }
        if (data[0].permission.search('95') >= 0) {
          this.permission19 = true;
        }
        if (data[0].permission.search('98') >= 0) {
          this.permission20 = true;
        }
        if (data[0].permission.search('99') >= 0) {
          this.permission21 = true;
        }
        if (data[0].permission.search('96') >= 0) {
          this.permission22 = true;
        }
      }

      //check box all
      if (this.permission1 && this.permission2 && this.permission3
        && this.permission4 && this.permission5 && this.permission6) {
        this.onCheckSystem = true;
      } else {
        this.onCheckSystem = false;
      }

      if (this.permission7) {
        this.onCheckImage = true;
      } else {
        this.onCheckImage = false;
      }

      if (this.permission8) {
        this.onCheckinFormation = true;
      } else {
        this.onCheckinFormation = false;
      }

      if (this.permission9 && this.permission10 && this.permission11
        && this.permission12 && this.permission13 && this.permission14
        && this.permission15 && this.permission16 && this.permission17
        && this.permission18 && this.permission19) {
        this.onCheckinChange = true;
      } else {
        this.onCheckinChange = false;
      }

      if (this.permission20 && this.permission21) {
        this.onCheckinCalendar = true;
      } else {
        this.onCheckinCalendar = false;
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

  // /**
  //  * on Load Data Websites
  //  */
  // onLoadDataWebsites() {
  //   const param = {};
  //   this.api.excuteAllByWhat(param, '60').subscribe(data => {
  //     if (data) {
  //       // process data site id
  //       data.forEach(item => {
  //         if (this.listSiteId && this.listSiteId.search(item.id) >= 0) {
  //           item.active = true;
  //         } else {
  //           item.active = false;
  //         }
  //       });
  //       this.websites = data;
  //     }
  //   });
  // }

  // /**
  //   * on Load Data Categories
  //   */
  // onLoadDataCategories() {
  //   const param = {};
  //   let dataSourceTemp = [];

  //   this.api.excuteAllByWhat(param, '37').subscribe(data => {
  //     if (data.length > 0) {
  //       // process add first parent
  //       let temp = {
  //         id: data[0].id1,
  //         title: data[0].title1,
  //         typeid: data[0].typeid1,
  //         arrange: data[0].arrange1,
  //         icon: data[0].icon1,
  //         link: data[0].link1
  //       };
  //       let firstId = data[0].id1;

  //       // this.groupFunction.push(temp);
  //       dataSourceTemp.push(temp);

  //       // loop and add parent of all part
  //       for (let i = 1; i < data.length - 1; i++) {
  //         // add child to list
  //         dataSourceTemp.push(data[i]);

  //         // check parent change
  //         if (firstId != data[i + 1].id1) {
  //           temp = {
  //             id: data[i + 1].id1,
  //             title: data[i + 1].title1,
  //             typeid: data[i + 1].typeid1,
  //             arrange: data[i + 1].arrange1,
  //             icon: data[i + 1].icon1,
  //             link: data[i + 1].link1
  //           };

  //           // add parent to list
  //           // this.groupFunction.push(temp);
  //           dataSourceTemp.push(temp);

  //           this.categories = dataSourceTemp;

  //           // update first id
  //           firstId = data[i + 1].id1;
  //         }
  //       }

  //       // process data categories active or inactive checkbox
  //       this.categories.forEach(item => {
  //         if (this.listCateId && this.listCateId.search(item.id) >= 0) {
  //           item.active = true;
  //         } else {
  //           item.active = false;
  //         }
  //       });

  //       // check all child is check or not check
  //       let isAllChecked;
  //       this.categories.forEach(item => {
  //         if (item.typeid == 0) {
  //           isAllChecked = true;
  //           for (let i = 0; i < this.categories.length; i++) {
  //             if (this.categories[i].typeid == item.id && !this.categories[i].active) {
  //               isAllChecked = false;
  //               break;
  //             }
  //           }

  //           // update active
  //           item.active = isAllChecked;
  //         }
  //       });
  //     }
  //   });
  // }

  /**
   * on Check box Parent Click
   * @param event 
   */
  onCheckSystemClick() {
    this.permission1 = !this.permission1;
    this.permission2 = !this.permission2;
    this.permission3 = !this.permission3;
    this.permission4 = !this.permission4;
    this.permission5 = !this.permission5;
    this.permission6 = !this.permission6;
  }
  onCheckImageClick() {
    this.permission7 = !this.permission7;
  }
  onCheckinFormationClick() {
    this.permission8 = !this.permission8;
  }
  onCheckinChangeClick() {
    this.permission9 = !this.permission9;
    this.permission10 = !this.permission10;
    this.permission11 = !this.permission11;
    this.permission12 = !this.permission12;
    this.permission13 = !this.permission13;
    this.permission14 = !this.permission14;
    this.permission15 = !this.permission15;
    this.permission16 = !this.permission16;
    this.permission17 = !this.permission17;
    this.permission18 = !this.permission18;
    this.permission19 = !this.permission19;
  }
  onCheckinCalendarClick() {
    this.permission20 = !this.permission20;
    this.permission21 = !this.permission21;
  }

  sysmember: Sys_member;

  //update sysmember

  /**
  * on Update Candidate 
  */
  onUpdateSysmember() {

    // load data targetjob
    this.sysmember.siteid = '';
    if (this.site1) {
      this.sysmember.siteid += '1';
    }
    if (this.site2) {
      this.sysmember.siteid += ',2';
    }
    if (this.site3) {
      this.sysmember.siteid += ',3';
    }
    if (this.site4) {
      this.sysmember.siteid += ',4';
    }
    if (this.site5) {
      this.sysmember.siteid += ',5';
    }
    if (this.site6) {
      this.sysmember.siteid += ',6';
    }
    if (this.site7) {
      this.sysmember.siteid += ',7';
    }
    if (this.site8) {
      this.sysmember.siteid += ',8';
    }
    if (this.site9) {
      this.sysmember.siteid += ',9';
    }
    if (this.site10) {
      this.sysmember.siteid += ',10';
    }
    if (this.site11) {
      this.sysmember.siteid += ',11';
    }
    if (this.site12) {
      this.sysmember.siteid += ',12';
    }
    if (this.site13) {
      this.sysmember.siteid += ',13';
    }
    if (this.site14) {
      this.sysmember.siteid += ',14';
    }
    if (this.site15) {
      this.sysmember.siteid += ',15';
    }
    if (this.site16) {
      this.sysmember.siteid += ',16';
    }
    if (this.site17) {
      this.sysmember.siteid += ',17';
    }
    if (this.site18) {
      this.sysmember.siteid += ',18';
    }
    if (this.site19) {
      this.sysmember.siteid += ',19';
    }
    if (this.site20) {
      this.sysmember.siteid += ',20';
    }
    if (this.site21) {
      this.sysmember.siteid += ',21';
    }
    if (this.site22) {
      this.sysmember.siteid += ',22';
    }
    if (this.site23) {
      this.sysmember.siteid += ',23';
    }

    //update permission
    this.sysmember.permission = '';
    if (this.permission1) {
      this.sysmember.permission += ',2';
    }
    if (this.permission2) {
      this.sysmember.permission += ',3';
    }
    if (this.permission3) {
      this.sysmember.permission += ',4';
    }
    if (this.permission4) {
      this.sysmember.permission += ',17';
    }
    if (this.permission5) {
      this.sysmember.permission += ',38';
    }
    if (this.permission6) {
      this.sysmember.permission += ',39';
    }
    if (this.permission7) {
      this.sysmember.permission += ',54';
    }
    if (this.permission8) {
      this.sysmember.permission += ',61';
    }
    if (this.permission9) {
      this.sysmember.permission += ',65';
    }
    if (this.permission10) {
      this.sysmember.permission += ',67';
    }
    if (this.permission11) {
      this.sysmember.permission += ',69';
    }
    if (this.permission12) {
      this.sysmember.permission += ',71';
    }
    if (this.permission13) {
      this.sysmember.permission += ',72';
    }
    if (this.permission14) {
      this.sysmember.permission += ',79';
    }
    if (this.permission15) {
      this.sysmember.permission += ',80';
    }
    if (this.permission16) {
      this.sysmember.permission += ',86';
    }
    if (this.permission17) {
      this.sysmember.permission += ',87';
    }
    if (this.permission18) {
      this.sysmember.permission += ',94';
    }
    if (this.permission19) {
      this.sysmember.permission += ',95';
    }
    if (this.permission20) {
      this.sysmember.permission += ',98';
    }
    if (this.permission21) {
      this.sysmember.permission += ',99';
    }
    if (this.permission22) {
      this.sysmember.permission += ',96';
    }

    // remove coret
    if (this.sysmember.siteid[0] == ',') {
      this.sysmember.siteid = this.sysmember.siteid.substr(1);
    }

    if (this.sysmember.permission[0] == ',') {
      this.sysmember.permission = this.sysmember.permission.substr(1);
    }

    this.subscription.push(this.api.excuteAllByWhat(this.sysmember, '42').subscribe(data => {
      if (data) {
        this.api.showSuccess('Cập nhật thành công');
      }
    }));
    this.onNoClick();
  }


  /**
   * On Cancel
   */
  onCancel() {
    this.ngOnInit();
  }


  /**
   * on Accept Permission Click
   */
  onAcceptPermissionClick() {
    // get siteid selection example: listId='1,2,6'
    let siteid = '';
    this.websites.forEach(item => {
      if (item.active) {
        if (siteid == '') {
          siteid += item.id;
        } else {
          siteid += ',' + item.id;
        }
      }
    });

    let permisstionid = '';
    this.categories.forEach(item => {
      if (item.active) {
        if (permisstionid == '') {
          permisstionid += item.id
        } else {
          permisstionid += ',' + item.id;
        }
      }
    });

    // start update siteid and permisstionid
    const param = { 'listsiteid': siteid, 'listcate': permisstionid, 'id': this.data['id'] };
    this.api.excuteAllByWhat(param, '48').subscribe(data => {

      if (data) {
        // show toast success
        this.api.showSuccess('Cập nhật thành công ');
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
