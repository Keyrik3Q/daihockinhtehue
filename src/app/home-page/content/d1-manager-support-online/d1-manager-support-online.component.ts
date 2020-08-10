import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Supportonline } from 'src/app/common/models/140supportonline.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-d1-manager-support-online',
    templateUrl: './d1-manager-support-online.component.html',
    styleUrls: ['./d1-manager-support-online.component.scss']
})
export class D1ManagerSupportOnlineComponent implements OnInit, OnDestroy {

    /** for table */
    subscription: Subscription[] = [];

    displayedColumns: string[] = ['select', 'stt', 'name', 'nick', 'phone', 'arrange', 'approved', 'edit'];

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
    // data source for combobox status
    status: any[] = [
        { value: '2', viewValue: 'Tất Cả' },
        { value: '0', viewValue: 'Chưa Duyệt' },
        { value: '1', viewValue: 'Đã Duyệt' }
    ];

    // data source for combobox typeid
    typeids: any[] = [
        { value: '0', viewValue: 'Yahoo' },
        { value: '1', viewValue: 'Skype' }
    ];

    // data source for combobox websites
    websites: any[] = [];

    // data source for combobox NoAllwebsites
    NoAllwebsites: any[] = [];

    // data arrange
    arrange: any[] = [];

    // data type
    typeId: string = '1';

    // binding models 
    // status
    statusId: string = '2';

    // website
    websiteId: string = '';

    // flag insert
    insertFlag: boolean = false;

    // model biding insert
    supportonline: Supportonline;

    // max Arrange
    maxArrange: number;

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
            typeid: [null],
            siteid: [null],
            name: [null, [Validators.required, Validators.maxLength(250)]],
            nick: [null, [Validators.required, Validators.maxLength(100)]],
            phone: [null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(12)]],
            note: [null, [Validators.required, Validators.email, Validators.maxLength(250)]],
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

            // add value website
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
        };
        this.subscription.push(this.api.excuteAllByWhat(param, '147').subscribe(data => {
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
        // init value for model
        this.supportonline = {
            siteid: '',
            typeid: '0',
            nick: '',
            name: '',
            arrange: '' + (this.maxArrange + 1),
            approved: false,
            note: '',
            phone: ''
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
                this.subscription.push(this.api.excuteAllByWhat(param, '143').subscribe(data => {
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
        });
        const param = { "id": listId };

        // start update status approved to one
        if (listId != '') {
            this.subscription.push(this.api.excuteAllByWhat(param, '148').subscribe(data => {
                // load data grid
                this.onFillterClick();

                // scroll top
                window.scroll({ left: 0, top: 0, behavior: 'smooth' });
                this.api.showSuccess('Sắp xếp thành công!');
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
        });
        const param = { "id": listId };

        // start update status approved to one
        if (listId != '') {
            this.subscription.push(this.api.excuteAllByWhat(param, '145').subscribe(data => {
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
        this.supportonline = row;

        //check approved and typeid
        this.supportonline.approved = this.supportonline.approved == 0 ? false : true;
        this.supportonline.typeid = this.supportonline.typeid == 0 ? '0' : '1';
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
        if (this.supportonline.id == undefined) {
            // update boolean to number approved and typeid
            this.supportonline.approved = this.supportonline.approved ? '1' : '0';
            this.supportonline.typeid = this.supportonline.typeid == 0 ? '1' : '0';

            this.subscription.push(this.api.excuteAllByWhat(this.supportonline, '141').subscribe(data => {
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
            // update boolean to number approved and typeid
            this.supportonline.approved = this.supportonline.approved ? '1' : '0';
            this.supportonline.typeid = this.supportonline.typeid == 0 ? '1' : '0';

            this.subscription.push(this.api.excuteAllByWhat(this.supportonline, '142').subscribe(data => {
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
        this.supportonline = {
            siteid: '',
            typeid: '0',
            nick: '',
            name: '',
            arrange: '',
            approved: false,
            note: '',
            phone: ''
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
        this.subscription.push(this.api.excuteAllByWhat(row, '142').subscribe(data => {
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
