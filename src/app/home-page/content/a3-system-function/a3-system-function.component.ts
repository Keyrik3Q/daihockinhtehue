import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/common/api-service/api.service';
import { Sys_functions } from 'src/app/common/models/30sys_functions.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-a3-system-function',
    templateUrl: './a3-system-function.component.html',
    styleUrls: ['./a3-system-function.component.scss']
})
export class A3SystemFunctionComponent implements OnInit, OnDestroy {
    /** for table */
    subscription: Subscription[] = [];

    displayedColumns: string[] = ['select', 'stt', 'title', 'sort', 'edit'];

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

    //flag insert
    insertFlag: boolean = false;

    // group function
    groupFunction: any[] = [];

    // model binding insert
    sys_functions: Sys_functions;

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
            arrange: [null, [Validators.required]],
            title: [null, [Validators.required,]],
            link: [null, [Validators.required]],
            groupFunction: [null],
        });
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy() {
        // unsubscribe api service
        this.subscription.forEach(sub => {
            sub.unsubscribe();
        });
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.sys_functions = {
            title: '',
            typeid: '',
            arrange: '',
            icon: '',
            link: '',
        }

        // load data first time
        this.onFillterClick();
    }

    /**
    * on Fillter Click
    */
    onFillterClick() {
        const param = {};
        let dataSourceTemp = [];

        this.api.excuteAllByWhat(param, '37').subscribe(data => {
            console.log(data);
            if (data.length > 0) {
                // process add first parent
                let temp = {
                    id: data[0].id1,
                    title: data[0].title1,
                    typeid: data[0].typeid1,
                    arrange: data[0].arrange1,
                    icon: data[0].icon1,
                    link: data[0].link1
                };
                let firstId = data[0].id1;
                this.groupFunction.push(temp);
                dataSourceTemp.push(temp);

                // loop and add parent of all part
                for (let i = 1; i < data.length - 1; i++) {
                    // add child to list
                    dataSourceTemp.push(data[i]);

                    // check parent change
                    if (firstId != data[i + 1].id1) {
                        temp = {
                            id: data[i + 1].id1,
                            title: data[i + 1].title1,
                            typeid: data[i + 1].typeid1,
                            arrange: data[i + 1].arrange1,
                            icon: data[i + 1].icon1,
                            link: data[i + 1].link1
                        };

                        // add parent to list
                        this.groupFunction.push(temp);
                        dataSourceTemp.push(temp);

                        // update first id
                        firstId = data[i + 1].id1;
                    }
                }

                // add last child to list
                dataSourceTemp.push(data[data.length - 1]);

                // set data for table	
                this.dataSource = new MatTableDataSource(dataSourceTemp);
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
            this.api.excuteAllByWhat(param, '33').subscribe(data => {

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
        const param = { 'listid': listId };

        // start update status approved to one
        if (listId != '') {
            this.subscription.push(this.api.excuteAllByWhat(param, '34').subscribe(data => {

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
        this.sys_functions = element;

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
            return;
        }

        this.api.excuteAllByWhat(this.sys_functions, '32').subscribe(data => {
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

    /**
     * on Cance lClick
     */
    onCancelClick() {
        this.sys_functions = {
            title: '',
            typeid: '',
            arrange: '',
            icon: '',
            link: '',
        }

        // clear form
        this.form.reset();
    }

    /**
     * onFocusoutArrange
     * @param row 
     * @param event 
     */
    onFocusoutArrange(row, event) {
        row.arrange = event.srcElement.value
        this.subscription.push(this.api.excuteAllByWhat(row, '32').subscribe(data => {
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
