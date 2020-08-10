import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Sys_menu } from 'src/app/common/models/10sys_menu.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
@Component({
    selector: 'app-a1-system-menu',
    templateUrl: './a1-system-menu.component.html',
    styleUrls: ['./a1-system-menu.component.scss']
})
export class A1SystemMenuComponent implements OnInit, OnDestroy {
    /** for table */
    subscription: Subscription[] = [];

    displayedColumns: string[] = ['select', 'id', 'title', 'check', 'sort', 'sort-input', 'edit'];

    dataSource = new MatTableDataSource<any>();
    dataSource1 = new MatTableDataSource<any>();
    displayedColumns1: string[] = ['select1', 'position'];

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
    // data of language
    languages: any[] = [
        { id: 'vn', name: 'Tiếng Việt' },
        { id: 'en', name: 'Tiếng Anh' },
        { id: 'fr', name: 'Tiếng Pháp' }
    ];

    // data of status
    status: any[] = [
        { value: 'tat-ca', viewValue: 'Tất Cả' },
        { value: 'chua-duyet', viewValue: 'Chưa Duyệt' },
        { value: 'da-duyet', viewValue: 'Đã Duyệt' }
    ];

    // data of website
    websites: any[] = [];

    //categorys
    categorys: any[] = [];

    //shows
    shows: any[] = [];

    // input model data
    lang: any = 'vn';

    //siteId
    siteId: any = '';

    //siteId
    positionId: any = '';

    // categoryId
    categoryId: string = '';

    // showsId
    showsId: string = '';

    // group function
    groupFunction: any[] = [];

    // flag insert
    insertFlag: boolean = false;

    // max Arrange
    maxArrange: number;

    // sys_menu
    sys_menu: Sys_menu

    // validate
    form: FormGroup;

    // menu position
    menu1: boolean = false;
    menu2: boolean = false;
    menu3: boolean = false;
    menu4: boolean = false;
    menu5: boolean = false;
    menu6: boolean = false;

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
            ptypeid: [null],
            title: [null, [Validators.required, Validators.maxLength(255)]],
            keyword: [null, [Validators.required]]
        });
    }

    /**
     * ngOn Init
     */
    ngOnInit() {
        // load data website id
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
        this.api.excuteAllByWhat(param, '60').subscribe(data => { 
            if (data) {
                this.websites = data;

                // Choose first value
                this.siteId = this.websites[0].id + '';

                // load data system menu
                this.onFillterClick();
            }
        });

    }

    /**
     * on Fillter Click
     */
    onFillterClick() {
        const param = {
            'lang': this.api.lang,
            'siteid': this.siteId,
            // offset: 0, limit: 10
        };

        let dataSourceTemp = [];
        let ans = 1;

        this.api.excuteAllByWhat(param, '17').subscribe(data => {             
            if (data.length > 0) {
                // process add first parent 
                let temp = {
                    stt: ans++,
                    id: data[0].id,
                    ptypeid: data[0].ptypeid,
                    siteid: data[0].siteid,
                    title: data[0].title,
                    keyword: data[0].keyword,
                    arrange: data[0].arrange,
                    position: data[0].position,
                    approved: data[0].approved,
                    lang: data[0].lang,
                    url: data[0].url,
                    intranet: data[0].intranet
                };
                dataSourceTemp.push(temp);

                // add first to childs 
                if (data[0].id1 != null) {
                    dataSourceTemp.push({
                        stt: '--',
                        id: data[0].id1,
                        ptypeid: data[0].ptypeid1,
                        siteid: data[0].siteid1,
                        title: data[0].title1,
                        keyword: data[0].keyword1,
                        arrange: data[0].arrange1,
                        position: data[0].position1,
                        approved: data[0].approved1,
                        lang: data[0].lang1,
                        url: data[0].url1,
                        intranet: data[0].intranet1
                    });
                }

                // loop and add parent of all part
                for (let i = 1; i < data.length - 1; i++) {
                    if (temp.id != data[i].id) {
                        temp = {
                            stt: 0,
                            id: data[i].id,
                            ptypeid: data[i].ptypeid,
                            siteid: data[i].siteid,
                            title: data[i].title,
                            keyword: data[i].keyword,
                            arrange: data[i].arrange,
                            position: data[i].position,
                            approved: data[i].approved,
                            lang: data[i].lang,
                            url: data[i].url,
                            intranet: data[i].intranet
                        };
                        dataSourceTemp.push({
                            stt: ans++,
                            id: data[i].id,
                            ptypeid: data[i].ptypeid,
                            siteid: data[i].siteid,
                            title: data[i].title,
                            keyword: data[i].keyword,
                            arrange: data[i].arrange,
                            position: data[i].position,
                            approved: data[i].approved,
                            lang: data[i].lang,
                            url: data[i].url,
                            intranet: data[i].intranet
                        });

                    } else {
                        if (data[i].id1 != null) {
                            dataSourceTemp.push({
                                stt: '--',
                                id: data[i].id1,
                                ptypeid: data[i].ptypeid1,
                                siteid: data[i].siteid1,
                                title: data[i].title1,
                                keyword: data[i].keyword1,
                                arrange: data[i].arrange1,
                                position: data[i].position1,
                                approved: data[i].approved1,
                                lang: data[i].lang1,
                                url: data[i].url1,
                                intranet: data[i].intranet1
                            });
                        }
                    }
                }

                // add last temp to list
                if (data[data.length - 1].id1 != null) {
                    dataSourceTemp.push({
                        stt: '--',
                        id: data[data.length - 1].id1,
                        ptypeid: data[data.length - 1].ptypeid1,
                        siteid: data[data.length - 1].siteid1,
                        title: data[data.length - 1].title1,
                        keyword: data[data.length - 1].keyword1,
                        arrange: data[data.length - 1].arrange1,
                        position: data[data.length - 1].position1,
                        approved: data[data.length - 1].approved1,
                        lang: data[data.length - 1].lang1,
                        url: data[data.length - 1].url1,
                        intranet: data[data.length - 1].intranet1
                    });
                } else {
                    dataSourceTemp.push({
                        stt: ans++,
                        id: data[data.length - 1].id,
                        ptypeid: data[data.length - 1].ptypeid,
                        siteid: data[data.length - 1].siteid,
                        title: data[data.length - 1].title,
                        keyword: data[data.length - 1].keyword,
                        arrange: data[data.length - 1].arrange,
                        position: data[data.length - 1].position,
                        approved: data[data.length - 1].approved,
                        lang: data[data.length - 1].lang,
                        url: data[data.length - 1].url,
                        intranet: data[data.length - 1].intranet1
                    });
                }

                // set data for table	
                this.dataSource = new MatTableDataSource(dataSourceTemp);
                
                //get max arrange
                this.maxArrange = -999;
                data.forEach(item => {
                    if (Number(item.arrange) > this.maxArrange) {
                        this.maxArrange = Number(item.arrange);
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
        const param = {};
        this.subscription.push(this.api.excuteAllByWhat(param, '19').subscribe(data => { 
            if (data.length > 0) {
                this.shows = data;
                this.showsId = data[0].keyword;
            } else {
                this.shows = [];
                this.showsId = '';
            }
        }));

        // init value for model 
        this.sys_menu = {
            ptypeid: '0',
            siteid: '',
            title: '',
            keyword: '',
            arrange: '' + (this.maxArrange + 1),
            position: '',
            approved: false,
            lang: this.api.lang,
            url: '',

        }

        // reset position
        this.menu1 = false;
        this.menu2 = false;
        this.menu3 = false;
        this.menu4 = false;
        this.menu5 = false;
        this.menu6 = false;

        this.insertFlag = !this.insertFlag;
        window.scrollTo({ left: 0, top: 10000, behavior: 'smooth' });
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
            this.subscription.push(this.api.excuteAllByWhat(param, '16').subscribe(data => {
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
     * on Sort Click
     */
    onSortClick() {

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

            this.subscription.push(this.api.excuteAllByWhat(param, '13').subscribe(data => {
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
     * on Update Click
     * @param row 
     */
    onUpdateClick(row) {
        const param = {};
        this.subscription.push(this.api.excuteAllByWhat(param, '19').subscribe(data => { 
            if (data.length > 0) {
                this.shows = data;
                this.showsId = data[0].keyword;
            } else {
                this.shows = [];
                this.showsId = '';
            }
        }));

        // load position
        if (row.position.search('1') >= 0) {
            this.menu1 = true;
        }
        if (row.position.search('2') >= 0) {
            this.menu2 = true;
        }
        if (row.position.search('5') >= 0) {
            this.menu3 = true;
        }
        if (row.position.search('6') >= 0) {
            this.menu4 = true;
        }
        if (row.position.search('7') >= 0) {
            this.menu5 = true;
        }
        if (row.position.search('8') >= 0) {
            this.menu6 = true;
        }
        this.sys_menu = row;
        this.sys_menu.approved = this.sys_menu.approved == 0 ? false : true;
        this.insertFlag = true;
        this.onComboboxWebsiteChange();
        window.scrollTo({ left: 0, top: 10000, behavior: 'smooth' });
    }

    /**
     * on Combobox Website Change    
     */
    onComboboxWebsiteChange() {
        const param = {
            // check siteid run Combobox Website Change with the fist or Insert
            'siteid': this.sys_menu.siteid,
            'lang': this.api.lang
        }
        let tempCategory = [
            {
                ptypeid: "0",
                title: "Thể loại Cha"
            }
        ];

        this.subscription.push(this.api.excuteAllByWhat(param, '18').subscribe(data => {
            if (data.length > 0) {
                // process data
                data.forEach(ele => {
                    // check item is parents
                    if (ele.ptypeid == 0) {
                        tempCategory.push(ele);
                        data.forEach(item => {
                            // check item is childrent
                            if (item.ptypeid == ele.id) {
                                item.title = item.title;
                                tempCategory.push(item);
                            }
                        });
                    }
                });

                this.categorys = tempCategory;
            } else {
                this.categorys = [];
                this.categoryId = '';
            }
        }));
    }

    /**
    * on Submit Click
    */
    onSubmitClick() {
        // return if error
        if (this.form.status != 'VALID') {
            this.api.showWarning('Vui lòng nhập các mục đánh dấu *!')
            return;
        }

        // load data position
        this.sys_menu.position = '';
        if (this.menu1) {
            this.sys_menu.position += '1';
        }
        if (this.menu2) {
            this.sys_menu.position += ',2';
        }
        if (this.menu3) {
            this.sys_menu.position += ',5';
        }
        if (this.menu4) {
            this.sys_menu.position += ',6';
        }
        if (this.menu5) {
            this.sys_menu.position += ',7';
        }
        if (this.menu6) {
            this.sys_menu.position += ',8';
        }

        // remove coret
        if (this.sys_menu.position[0] == ',') {
            this.sys_menu.position = this.sys_menu.position.substr(1);
        }


        // check update or insert
        if (this.sys_menu.id == undefined) {
            // update boolean to number approved and typeid
            this.sys_menu.approved = this.sys_menu.approved ? '1' : '0';

            this.subscription.push(this.api.excuteAllByWhat(this.sys_menu, '11').subscribe(data => {
                if (data) {
                    // load data grid
                    this.onFillterClick();

                    // // clear forms
                    // this.form.reset();

                    // clear data
                    this.onCancelClick();
                    this.insertFlag = false;

                    // scroll top
                    window.scroll({ left: 0, top: 0, behavior: 'smooth' });
                    this.api.showSuccess('Thêm mới thành công!');
                }
            }));
        } else {
            // update boolean to number approved and typeid
            this.sys_menu.approved = this.sys_menu.approved ? '1' : '0';

            this.subscription.push(this.api.excuteAllByWhat(this.sys_menu, '12').subscribe(data => {
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
        this.sys_menu = {
            ptypeid: '0',
            siteid: '',
            title: '',
            keyword: '',
            arrange: '' + (this.maxArrange + 1),
            position: '',
            approved: false,
            lang: this.api.lang,
            url: '',
            intranet: ''
        }

        // clear forms
        this.form.reset();
    }

    /**
     * onFocusoutArrange
     * @param element 
     * @param event 
     */
    onFocusoutArrange(element, event) {
        element.arrange = event.srcElement.value
        this.subscription.push(this.api.excuteAllByWhat(element, '12').subscribe(data => {
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

}
