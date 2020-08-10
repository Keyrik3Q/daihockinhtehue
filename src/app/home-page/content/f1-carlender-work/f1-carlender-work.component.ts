import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Schedule } from 'src/app/common/models/210schedule.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-f1-carlender-work',
    templateUrl: './f1-carlender-work.component.html',
    styleUrls: ['./f1-carlender-work.component.scss']
})
export class F1CarlenderWorkComponent implements OnInit, OnDestroy {
    /** for table */
    subscription: Subscription[] = [];

    displayedColumns: string[] = ['select', 'stt', 'content', 'approved', 'sdate', 'edit'];

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

    //data source for combobox hours
    hours: any[] = []

    //data source for combobox mitune
    minutes: any[] = [
        { value: '00', viewValue: '00' },
        { value: '15', viewValue: '15' },
        { value: '30', viewValue: '30' },
        { value: '45', viewValue: '45' }
    ]

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

    // content
    contentId: string = '';

    // sdate
    sdateId: string = '';

    // minute
    minute: string = '';

    // stime
    stimeId: string = '';

    // stakeholder
    stakeholderId: string = '';

    // location
    locationId: string = '';

    // host
    hostId: string = '';

    // postdate
    postdateId: string = '';

    // flag insert
    insertFlag: boolean = false;

    // model biding insert
    schedule: Schedule;

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
            sdate: [null, [Validators.required]],
            stime: [null, [Validators.required]],
            minute: [null, [Validators.required]]
        });
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        // init value for hour
        for (let i = 0; i < 24; i++) {
            this.hours.push({ value: (i + 1) < 10 ? '0' + (i + 1) : (i + 1), viewValue: (i + 1) + 'h' });
        }

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
        this.subscription.push(this.api.excuteAllByWhat(param, '210').subscribe(data => {
            if (data.length > 0) {
                // set data for table	
                this.dataSource = new MatTableDataSource(data);

                // load data schedule
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
            'content': this.contentId.trim(),
        };

        this.subscription.push(this.api.excuteAllByWhat(param, '217').subscribe(data => {
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
        this.schedule = {
            sdate: '',
            stime: '',
            content: '',
            stakeholder: '',
            location: '',
            host: '',
            approved: false,
            postdate: '',
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
        const param = { 'id': listId };

        // start update status approved to one
        if (listId != '') {
            this.subscription.push(this.api.excuteAllByWhat(param, '218').subscribe(data => {
                if (data) {
                    // load data grid
                    this.onFillterClick();

                    // scroll top
                    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
                    this.api.showSuccess('Duyệt thành công');
                }
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
        // update time and update to database
        this.schedule = row;

        // convert: hh:mm:ss=> hh(hour):mm(minute)
        this.minute = this.schedule.stime.substr(3, 2);
        this.schedule.stime = this.schedule.stime.substr(0, 2);

        //check approved
        this.schedule.approved = this.schedule.approved == 0 ? false : true;
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

        const param = { 'id': listId };

        // start update status approved to one
        if (listId != '') {
            this.subscription.push(this.api.excuteAllByWhat(param, '213').subscribe(data => {
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
        if (this.schedule.id == undefined) {
            // update boolean to number
            this.schedule.approved = this.schedule.approved ? '1' : '0';

            //format Data & add minute
            this.schedule.sdate = this.api.formatDate(new Date(this.schedule.sdate));
            this.schedule.stime += ':' + this.minute + ':00';

            this.subscription.push(this.api.excuteAllByWhat(this.schedule, '211').subscribe(data => {
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
            this.schedule.approved = this.schedule.approved ? '1' : '0';

            //format Data & add minute
            this.schedule.sdate = this.api.formatDate(new Date(this.schedule.sdate));
            this.schedule.stime += ':' + this.minute + ':00';

            this.subscription.push(this.api.excuteAllByWhat(this.schedule, '212').subscribe(data => {
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
        this.schedule = {
            sdate: '',
            stime: '',
            content: '',
            stakeholder: '',
            location: '',
            host: '',
            approved: false,
            postdate: '',
            lang: this.api.lang
        };

        // clear forms
        this.form.reset();
    }
}
