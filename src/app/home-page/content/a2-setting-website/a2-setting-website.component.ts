import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sys_configsite } from 'src/app/common/models/20sys_configsite.models'
import { Sys_member } from 'src/app/common/models/40sys_member.models';

@Component({
    selector: 'app-a2-setting-website',
    templateUrl: './a2-setting-website.component.html',
    styleUrls: ['./a2-setting-website.component.scss']
})
export class A2SettingWebsiteComponentt implements OnInit, OnDestroy {
    /** for table */
    subscription: Subscription[] = [];

    displayedColumns: string[] = ['select', 'stt', 'title', 'approved', 'edit'];

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

    // binding models
    // language
    languageId: string = 'vn';

    // status
    statusId: string = '2';

    // website
    websiteId: any;

  

    // flag insert
    insertFlag: boolean = false;

    // model biding insert
    sys_configsite: Sys_configsite;

    // validate
    form: FormGroup;

    //siteid
    sys_memberid: number;

    /**
     * constructor
     * @param api 
     */
    constructor(private api: ApiService,
        private formBuilder: FormBuilder) {
        // add validate for controls
        this.form = this.formBuilder.group({
            title: [null, [Validators.required]],
        });

        this.sys_memberid = this.api.getSysMemberValue.siteid;
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
        const param = {
            'siteid': this.sys_memberid,
        };
        console.log(param);
        this.subscription.push(this.api.excuteAllByWhat(param, '28').subscribe(data => {
            this.NoAllwebsites = data;
            
            
            if (data.length > 0) {
                let temp = [
                    {
                        siteid: "0",
                        title: "Tất Cả"
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
            'siteid': this.websiteId == 0 ? this.sys_memberid : this.websiteId,
            'approved': this.statusId,
            'lang': this.api.lang
        };

        this.subscription.push(this.api.excuteAllByWhat(param, '25').subscribe(data => {
            if (data.length > 0) {
                console.log('adn',data);
                
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
        this.sys_configsite = {
            siteid: '',
            title: '',
            keywords: '',
            description: '',
            footer: '',
            approved: false,
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
        let listId = '';
        this.selection.selected.forEach(item => {
            if (listId == '') {
                listId = item.id;
            } else {
                listId += ',' + item.id;
            }
        });

        const param = { "listid": listId };

        // start update status approved to one
        if (listId != '') {
            this.subscription.push(this.api.excuteAllByWhat(param, '26').subscribe(data => {
                // load data grid
                this.onFillterClick();

                // scroll top
                window.scroll({ left: 0, top: 0, behavior: 'smooth' });

                this.api.showSuccess('Duyệt thành công');
            }));
        } else {
            this.api.showWarning('Vui lòng chọn ít nhất một mục');
        }
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

        const param = { "listid": listId };

        // start update status approved to one
        if (listId != '') {
            this.subscription.push(this.api.excuteAllByWhat(param, '27').subscribe(data => {
                // load data grid
                this.onFillterClick();

                // scroll top
                window.scroll({ left: 0, top: 0, behavior: 'smooth' });

                this.api.showSuccess('Xóa thành công');
            }));
        } else {
            this.api.showWarning('Vui lòng chọn ít nhất một mục');
        }
    }

    /**
     * on Update Click
     * @param row 
     */
    onUpdateClick(row) {
        this.sys_configsite = row;

        this.insertFlag = true;

        setTimeout(() => {
            window.scroll({ left: 0, top: 1000, behavior: 'smooth' });
        }, 100);
    }

    /**
     * on Submit Click
     */
    onSubmitClick() {
        // return if error
        if (this.form.status != 'VALID') {
            return;
        }

        // check update or insert
        if (this.sys_configsite.id == undefined) {
            // update boolean to number
            this.sys_configsite.approved = this.sys_configsite.approved ? '1' : '0';

            this.subscription.push(this.api.excuteAllByWhat(this.sys_configsite, '21').subscribe(data => {
                if (data) {
                    this.api.showSuccess('Thêm mới thành công');

                    // load data grid
                    this.onFillterClick();

                    // clear data
                    this.onCancelClick();
                    this.insertFlag = false;

                    // scroll top
                    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
                }
            }));
        } else {
            // update boolean to number
            this.sys_configsite.approved = this.sys_configsite.approved ? '1' : '0';

            this.subscription.push(this.api.excuteAllByWhat(this.sys_configsite, '22').subscribe(data => {
                if (data) {
                    this.api.showSuccess('Cập nhật thành công');

                    // load data grid
                    this.onFillterClick();

                    // clear data
                    this.onCancelClick();
                    this.insertFlag = false;

                    // scroll top
                    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
                }
            }));
        }


    }

    /**
     * on Cancel Click
     */
    onCancelClick() {
        this.sys_configsite = {
            siteid: '',
            title: '',
            keywords: '',
            description: '',
            footer: '',
            approved: false,
            lang: this.api.lang
        };
    }
}
