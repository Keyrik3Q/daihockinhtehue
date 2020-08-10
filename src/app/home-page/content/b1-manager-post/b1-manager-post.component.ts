import { Component, OnInit, ViewChild, OnDestroy, Inject, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Contents } from 'src/app/common/models/90contents.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GManageFileComponent } from '../g-manage-file/g-manage-file.component';

@Component({
    selector: 'app-b1-manager-post',
    templateUrl: './b1-manager-post.component.html',
    styleUrls: ['./b1-manager-post.component.scss']
})
export class B1ManagerPostComponent implements OnInit, OnDestroy {

    /** for table */
    subscription: Subscription[] = [];

    displayedColumns: string[] = ['select', 'stt', 'title', 'approved', 'changedate', 'edit'];

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

    // category
    categoryId: string = '';

    // flag insert
    insertFlag: boolean = false;

    //name Author
    nameAuthor: string = '';

    // model biding insert
    contents: Contents;

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

            // on combobox websites change
            this.onComboboxWebsiteChange(false);
            this.onFillterClick();
        }));
    }

    /**
     * on Combobox Website Change
     * @param isInsert => 
     */
    onComboboxWebsiteChange(isInsert) {
        const param = {
            // check siteid run Combobox Website Change with the fist or Insert
            'siteid': isInsert ? this.contents.siteid : this.websiteId,
            'lang': this.api.lang
        }

        let tempCategory = [];

        this.subscription.push(this.api.excuteAllByWhat(param, '99').subscribe(data => {
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
                this.categoryId = data[0].typeid;
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

        this.subscription.push(this.api.excuteAllByWhat(param, '97').subscribe(data => {
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
        this.contents = {
            typeid: '',
            siteid: '',
            title: '',
            url: '',
            summary: '',
            content: '',
            pathimage: '',
            comment: '',
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
            this.subscription.push(this.api.excuteAllByWhat(param, '98').subscribe(data => {
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
        this.subscription.push(this.api.excuteAllByWhat(param, '94').subscribe(data => {
            if (data.length > 0) {
                this.contents = data[0];
                this.contents.postdate = new Date();

                //check approved
                this.contents.approved = this.contents.approved == 0 ? false : true;
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

            this.subscription.push(this.api.excuteAllByWhat(param, '93').subscribe(data => {
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
            this.api.showWarning('Vui lòng nhập các mục đánh dấu *');
            return;
        }

        // check update or insert
        if (this.contents.id == undefined) {
            // update boolean to number
            this.contents.approved = this.contents.approved ? '1' : '0';

            //changedate
            this.contents.changedate = this.contents.postdate;

            //format Data & add minute
            this.contents.postdate = this.api.formatDate(new Date(this.contents.postdate));
            this.contents.changedate = this.api.formatDate(new Date(this.contents.changedate));

            this.subscription.push(this.api.excuteAllByWhat(this.contents, '91').subscribe(data => {
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
            this.contents.approved = this.contents.approved ? '1' : '0';

            // changedate
            this.contents.changedate = this.contents.postdate;

            //format Data & add minute
            this.contents.postdate = this.api.formatDate(new Date(this.contents.postdate));
            this.contents.changedate = this.api.formatDate(new Date(this.contents.changedate));

            this.subscription.push(this.api.excuteAllByWhat(this.contents, '92').subscribe(data => {
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
        this.contents = {
            typeid: '',
            siteid: '',
            title: '',
            url: '',
            summary: '',
            content: '',
            pathimage: '',
            comment: '',
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
     * open Dialog
     * @param element 
     */
    openDialog(element): void {
        const dialogRef = this.dialog.open(ManagerPostDialog, {
            width: '950px',
            height: '500px',
            data: element

        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection = new SelectionModel<any>(true, []);
        });
        
    }

    /**
     * open Dialog Choose file
     */
    openDialogChoosefile() {
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
        this.contents.pathimage = (await navigator.clipboard.readText());
    }


}


@Component({
    selector: 'b1-manager-post-dialog.component',
    templateUrl: 'b1-manager-post-dialog.component.html',
    styleUrls: ['./b1-manager-post.component.scss']
})
export class ManagerPostDialog implements OnInit, OnDestroy {
    subscription: Subscription[] = [];
    dataInput: any;
    content: any = { content: '' };

    @ViewChild('data', { read: ElementRef, static: true })
    public data: ElementRef;
    dialog: MatDialog;


    constructor(
        public dialogRef: MatDialogRef<ManagerPostDialog>,
        @Inject(MAT_DIALOG_DATA) public input: ManagerPostDialog,
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
        this.subscription.push(this.api.excuteAllByWhat(param, '94').subscribe(data => {
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


    // open dialog for choosing file


}