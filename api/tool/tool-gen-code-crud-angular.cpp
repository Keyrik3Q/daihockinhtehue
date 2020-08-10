#include<iostream>
#include<bits/stdc++.h>
#include <dir.h> 
#include <process.h> 
//#include <boost/algorithm/string.hpp> 

using namespace std;

vector<string> split(string str,string delimiter){  
	vector<string> result;
	size_t pos = 0; 
	while ((pos = str.find(delimiter)) != string::npos) {
	   	result.push_back(str.substr(0, pos)); 
	    str.erase(0, pos + delimiter.length());
	} 
	result.push_back(str.substr(0, str.length()-1)); 
	return result;
}

/**
* genHtml
*/
void genDialogHtml(string table, string tableUppercase, vector<string> result){ 
	string fileName = table+ "/"+ table + "-dialog.html";
	ofstream cout (fileName.c_str());
	  
	cout<<"<mat-card class=\"border border-info\">	"<<endl; 
	cout<<"    <div class=\"alert alert-info text-center\" role=\"alert\">	"<<endl; 
	cout<<"        <h5 class=\"text-uppercase font-weight-bolder\">Thông tin "<<tableUppercase<<"</h5>	"<<endl; 
	cout<<"    </div>	"<<endl; 
	cout<<"	"<<endl; 
	cout<<"    <mat-card-content class=\"custom-overflow\">	"<<endl; 


	for(int i=1;i<result.size();i++){ 
		char firstUpper = toupper(result[i][0]);
		string uppercaseParam =  firstUpper + result[i].substr(1);
		
		cout<<"        <!-- "<<result[i]<<" field -->	"<<endl;
		cout<<"        <mat-form-field class=\"example-full-width\">	"<<endl;
		cout<<"          <input matInput [(ngModel)]=\"input."<<result[i]<<"\" [required]=\"'true'\" placeholder=\""<<uppercaseParam<<"\">	"<<endl;
		cout<<"        </mat-form-field>	"<<endl;
		cout<<"	"<<endl;
	} 
	cout<<"    </mat-card-content>	"<<endl; 
	cout<<"	"<<endl; 
	cout<<"    <div class=\"text-center\">	"<<endl; 
	cout<<"        <button *ngIf=\"type == 1\" (click)=\"onDeleteClick()\" class=\"btn btn-danger custom-margin-button\" mat-button>Xóa	"<<endl; 
	cout<<"        </button>	"<<endl; 
	cout<<"        <button class=\"btn btn-warning custom-margin-button\" mat-button [mat-dialog-close]=\"data.animal\">Đóng</button>	"<<endl; 
	cout<<"        <button cdkFocusInitial (click)=\"onOkClick()\" class=\"btn btn-info custom-margin-button\" mat-button>Đồng	"<<endl; 
	cout<<"            ý</button>	"<<endl; 
	cout<<"    </div>	"<<endl; 
	cout<<"	"<<endl; 
	cout<<"</mat-card>	"<<endl;  
}

/**
* genHtml
*/
void genHtml(string table, string tableUppercase, vector<string> result){ 
	string fileName = table+ "/"+ table + ".component.html";
	ofstream cout (fileName.c_str());
	  
	cout<<"<div class=\"alert alert-info text-center\" role=\"alert\">	"<<endl;
	cout<<"<h5 class=\"text-uppercase font-weight-bolder\">Hệ thống Quản Lý Đại Lý</h5>	"<<endl;
	cout<<"</div>	"<<endl;
	cout<<"	"<<endl;
	cout<<"<div class=\"text-center\">	"<<endl;
	cout<<"<button (click)=\"onInsertData()\" class=\"btn btn-info custom-margin-button\" mat-button 	"<<endl;
	cout<<"cdkFocusInitial>Thêm Đại Lý</button>	"<<endl;
	cout<<"</div>	"<<endl;
	cout<<"	"<<endl;
	cout<<"<mat-form-field>	"<<endl;
	cout<<"<input matInput (keyup)=\"applyFilter($event.target.value)\" placeholder=\"Tìm kiếm giao dịch\">	"<<endl;
	cout<<"</mat-form-field>	"<<endl;
	cout<<"	"<<endl;
	cout<<"<div class=\"mat-elevation-z8\">	"<<endl;
	cout<<"<table mat-table [dataSource]=\"dataSource\" matSort>	"<<endl;
	cout<<"	"<<endl;
	 
	for(int i=0;i<result.size();i++){
		char firstUpper = toupper(result[i][0]);
		string uppercaseParam =  firstUpper + result[i].substr(1);
		
		cout<<"        <!-- "<<result[i]<<" Column -->	"<<endl;
		cout<<"        <ng-container matColumnDef=\""<<result[i]<<"\">	"<<endl;
		cout<<"          <th mat-header-cell *matHeaderCellDef mat-sort-header> "<<uppercaseParam<<" </th>	"<<endl;
		cout<<"          <td mat-cell *matCellDef=\"let element\"> {{element."<<result[i]<<"}} </td>	"<<endl;
		cout<<"        </ng-container>	"<<endl;
		cout<<"	"<<endl;
	}  

	cout<<"	"<<endl;
	cout<<"	"<<endl;
	cout<<"<tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>	"<<endl;
	cout<<"<tr mat-row (dblclick)=\"onUpdateData(row)\" class=\"example-element-row\" *matRowDef=\"let row; columns: displayedColumns;\">	"<<endl;
	cout<<"</tr>	"<<endl;
	cout<<"</table>	"<<endl;
	cout<<"	"<<endl;
	cout<<"<mat-paginator [pageSizeOptions]=\"[5, 10, 20, 40]\" showFirstLastButtons></mat-paginator>	"<<endl;
	cout<<"</div>	"<<endl;

}

/**
* gen css
*/
void genCss(string table, string tableUppercase, vector<string> result){ 
	string fileName =  table+ "/"+ table + ".component.scss";
	ofstream cout (fileName.c_str());
	  
	cout<<".example-full-width {	"<<endl;
	cout<<"width: 100%;	"<<endl;
	cout<<"}	"<<endl;
	cout<<"	"<<endl;
	cout<<".custom-border {	"<<endl;
	cout<<"padding: 10px;	"<<endl;
	cout<<"margin-bottom: 10px;	"<<endl;
	cout<<"margin-left: 5px;	"<<endl;
	cout<<"margin-right: 15px;	"<<endl;
	cout<<"}	"<<endl;
	cout<<"	"<<endl;
	cout<<".custom-overflow {	"<<endl;
	cout<<"// max-height: 350px;	"<<endl;
	cout<<"overflow-y: auto;	"<<endl;
	cout<<"}	"<<endl;
	cout<<"	"<<endl;
	cout<<".custom-margin-button {	"<<endl;
	cout<<"margin-right: 10px;	"<<endl;
	cout<<"}	"<<endl;
	cout<<"	"<<endl;
	cout<<"td,	"<<endl;
	cout<<"th {	"<<endl;
	cout<<"    width: "<<floor(100/result.size())<<"%;	"<<endl;
	cout<<"}	"<<endl;
	cout<<"	"<<endl;
	cout<<"	"<<endl;
	cout<<"table {	"<<endl;
	cout<<"width: 100%;	"<<endl;
	cout<<"}	"<<endl;
	cout<<"	"<<endl;
	cout<<".mat-form-field {	"<<endl;
	cout<<"font-size: 14px;	"<<endl;
	cout<<"width: 100%;	"<<endl;
	cout<<"}	"<<endl;


}


/**
* gen component
*/
void genComponent(string table, string tableUppercase, vector<string> result){ 
	string fileName =  table+ "/"+ table + ".component.ts";
	ofstream cout (fileName.c_str()); 
	  
	cout<<"import { Component, OnInit, Inject, ViewChild } from '@angular/core';	"<<endl;
	cout<<"import { ApiService } from '../../../common/api-service/api.service';	"<<endl;
	cout<<"import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';	"<<endl;
	cout<<"import { Observable, Observer, Subscription } from 'rxjs';	"<<endl;
	cout<<"	"<<endl;
	cout<<"@Component({	"<<endl;
	cout<<"  selector: 'app-"<<table<<"',	"<<endl;
	cout<<"  templateUrl: './"<<table<<".component.html',	"<<endl;
	cout<<"  styleUrls: ['./"<<table<<".component.scss']	"<<endl;
	cout<<"})	"<<endl;
	cout<<"export class "<<tableUppercase<<"Component implements OnInit {	"<<endl;
	cout<<"	"<<endl;
	cout<<"  /** for table */	"<<endl;
	cout<<"  subscription: Subscription[] = [];	"<<endl;
	cout<<"	"<<endl;

	string param = "";
	for(int i=0;i<result.size();i++){
		if(i<result.size()-1){
			param +="'"+result[i]+"', ";
		}else{
			param +="'"+result[i]+"'";
		}
	}
	cout<<"  displayedColumns: string[] = ["<<param<<"];	"<<endl; 

	cout<<"	"<<endl;
	cout<<"  dataSource: MatTableDataSource<any>;	"<<endl;
	cout<<"	"<<endl;
	cout<<"  @ViewChild(MatPaginator) paginator: MatPaginator;	"<<endl;
	cout<<"  @ViewChild(MatSort) sort: MatSort;	"<<endl;
	cout<<"	"<<endl;
	cout<<"  applyFilter(filterValue: string) {	"<<endl;
	cout<<"    this.dataSource.filter = filterValue.trim().toLowerCase();	"<<endl;
	cout<<"	"<<endl;
	cout<<"    if (this.dataSource.paginator) {	"<<endl;
	cout<<"      this.dataSource.paginator.firstPage();	"<<endl;
	cout<<"    }	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"  /** for table */	"<<endl;
	cout<<"	"<<endl;
	cout<<"  constructor(	"<<endl;
	cout<<"    private api: ApiService,	"<<endl;
	cout<<"    public dialog: MatDialog	"<<endl;
	cout<<"  ) { }	"<<endl;
	cout<<"	"<<endl;
	cout<<"	"<<endl;
	cout<<"  ngOnInit() {	"<<endl;
	cout<<"	"<<endl;
	cout<<"    // get trains	"<<endl;
	cout<<"    this.get"<<tableUppercase<<"();	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"	"<<endl;
	cout<<"  /**	"<<endl;
	cout<<"   * get Data get"<<tableUppercase<<"  	"<<endl;
	cout<<"   */	"<<endl;
	cout<<"  get"<<tableUppercase<<"() {	"<<endl;
	cout<<"    this.api.excuteAllByWhat({ 'idCompany': this.api.idCompany }, 'searchData"<<tableUppercase<<"OfCompany')	"<<endl;
	cout<<"      .subscribe(data => {	"<<endl;
	cout<<"        data = this.api.convertToData(data);	"<<endl;
	cout<<"	"<<endl;
	cout<<"        // set data for table	"<<endl;
	cout<<"        this.dataSource = new MatTableDataSource(data);	"<<endl;
	cout<<"        this.dataSource.paginator = this.paginator;	"<<endl;
	cout<<"        this.dataSource.sort = this.sort;	"<<endl;
	cout<<"      })	"<<endl;
	cout<<"	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"	"<<endl;
	cout<<"  /**	"<<endl;
	cout<<"   * on insert data	"<<endl;
	cout<<"   * @param event 	"<<endl;
	cout<<"   */	"<<endl;
	cout<<"  onInsertData() {	"<<endl;
	cout<<"    const dialogRef = this.dialog.open("<<tableUppercase<<"Dialog, {	"<<endl;
	cout<<"      width: '400px',	"<<endl;
	cout<<"      data: { type: 0, id: 0 }	"<<endl;
	cout<<"    });	"<<endl;
	cout<<"	"<<endl;
	cout<<"    dialogRef.afterClosed().subscribe(result => { 	"<<endl;
	cout<<"      if (result) { 	"<<endl;
	cout<<"        this.get"<<tableUppercase<<"();	"<<endl;
	cout<<"      }	"<<endl;
	cout<<"    });	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"	"<<endl;
	cout<<"  /**	"<<endl;
	cout<<"   * on update data	"<<endl;
	cout<<"   * @param event 	"<<endl;
	cout<<"   */	"<<endl;
	cout<<"  onUpdateData(row) {	"<<endl;
	cout<<"    const dialogRef = this.dialog.open("<<tableUppercase<<"Dialog, {	"<<endl;
	cout<<"      width: '400px',	"<<endl;
	cout<<"      data: { type: 1, input: row }	"<<endl;
	cout<<"    });	"<<endl;
	cout<<"	"<<endl;
	cout<<"    dialogRef.afterClosed().subscribe(result => { 	"<<endl;
	cout<<"      if (result) { 	"<<endl;
	cout<<"        this.get"<<tableUppercase<<"();	"<<endl;
	cout<<"      }	"<<endl;
	cout<<"    });	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"}	"<<endl;
	cout<<"	"<<endl;
	cout<<"	"<<endl;
	cout<<"/**	"<<endl;
	cout<<" * Component show thông tin để insert hoặc update	"<<endl;
	cout<<" */	"<<endl;
	cout<<"@Component({	"<<endl;
	cout<<"  selector: '"<<table<<"-dialog',	"<<endl;
	cout<<"  templateUrl: '"<<table<<"-dialog.html',	"<<endl;
	cout<<"  styleUrls: ['./"<<table<<".component.scss']	"<<endl;
	cout<<"})	"<<endl;
	cout<<"export class "<<tableUppercase<<"Dialog implements OnInit {	"<<endl;
	cout<<"	"<<endl;
	cout<<"  observable: Observable<any>;	"<<endl;
	cout<<"  observer: Observer<any>;	"<<endl;
	cout<<"  type: number;	"<<endl;
	cout<<"  idCompany: number;	"<<endl;
	cout<<"	"<<endl;
	
	cout<<"  // init input value	"<<endl;
	cout<<"  input: any = {	"<<endl;
	
	for(int i=1;i<result.size();i++){
		cout<<"    "<<result[i]<<": '',	"<<endl;
	} 
	
	cout<<"  };	"<<endl;
	
	cout<<"	"<<endl;
	
	cout<<"  constructor(	"<<endl;
	cout<<"    public dialogRef: MatDialogRef<"<<tableUppercase<<"Dialog>,	"<<endl;
	cout<<"    @Inject(MAT_DIALOG_DATA) public data: any,	"<<endl;
	cout<<"    private api: ApiService	"<<endl;
	cout<<"  ) {	"<<endl;
	cout<<"    this.type = data.type;	"<<endl;
	cout<<"    this.input.idCompany = this.api.idCompany;	"<<endl;
	cout<<"	"<<endl;
	cout<<"    // nếu là update	"<<endl;
	cout<<"    if (this.type == 1) {	"<<endl;
	cout<<"      this.input = data.input;	"<<endl;
	cout<<"    }	"<<endl;
	cout<<"	"<<endl;
	cout<<"    console.log('data nhan duoc ', this.data);	"<<endl;
	cout<<"	"<<endl;
	cout<<"    // xử lý bất đồng bộ	"<<endl;
	cout<<"    this.observable = Observable.create((observer: any) => {	"<<endl;
	cout<<"      this.observer = observer;	"<<endl;
	cout<<"    });	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"	"<<endl;
	cout<<"  /**	"<<endl;
	cout<<"   * ngOnInit	"<<endl;
	cout<<"   */	"<<endl;
	cout<<"  ngOnInit() {	"<<endl;
	cout<<"	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"	"<<endl;
	cout<<"	"<<endl;
	cout<<"  /**	"<<endl;
	cout<<"   * on ok click	"<<endl;
	cout<<"   */	"<<endl;
	cout<<"  onOkClick(): void {	"<<endl;
	cout<<"    // convert data time	"<<endl;
	cout<<"    // this.input.born = new Date(this.input.born);	"<<endl;
	cout<<"    // this.input.born = this.api.formatDate(this.input.born);	"<<endl;
	cout<<"	"<<endl;
	cout<<"      this.api.excuteAllByWhat(this.input, 'createData"<<tableUppercase<<"').subscribe(data => {	"<<endl;
	cout<<"        this.dialogRef.close(true);	"<<endl;
	cout<<"        this.api.showSuccess(\"Xử Lý Thành Công!\");	"<<endl;
	cout<<"      });	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"	"<<endl;
	cout<<"  /**	"<<endl;
	cout<<"   * onDeleteClick	"<<endl;
	cout<<"   */	"<<endl;
	cout<<"  onDeleteClick() {	"<<endl;
	cout<<"    this.api.excuteAllByWhat(this.input, 'deleteData"<<tableUppercase<<"').subscribe(data => {	"<<endl;
	cout<<"      this.dialogRef.close(true);	"<<endl;
	cout<<"      this.api.showSuccess(\"Xử Lý Xóa Thành Công!\");	"<<endl;
	cout<<"    });	"<<endl;
	cout<<"  }	"<<endl;
	cout<<"}	"<<endl;

}

/**
* gen module
*/
void genModule(string table, string tableUppercase, vector<string> result){ 
	string fileName =  table+ "/"+ table + ".module.ts";
	ofstream cout (fileName.c_str());
	  
  
	cout<<"	import { NgModule } from '@angular/core';	"<<endl;
	cout<<"	import { CommonModule } from '@angular/common';	"<<endl;
	cout<<"	import { "<<tableUppercase<<"Component, "<<tableUppercase<<"Dialog } from './"<<table<<".component';	"<<endl;
	cout<<"import { TransferHttpCacheModule } from '@nguniversal/common';	"<<endl;
	cout<<"import { RouterModule } from '@angular/router';	"<<endl;
	cout<<"import { FormsModule, ReactiveFormsModule } from '@angular/forms';	"<<endl;
	cout<<"import {	"<<endl;
	cout<<"  MatInputModule,	"<<endl;
	cout<<"  MatDatepickerModule,	"<<endl;
	cout<<"  MatNativeDateModule,	"<<endl;
	cout<<"  MatSelectModule,	"<<endl;
	cout<<"  MatRadioModule,	"<<endl;
	cout<<"  MatDialogModule,	"<<endl;
	cout<<"  MatCardModule,	"<<endl;
	cout<<"  MatSortModule,	"<<endl;
	cout<<"  MatTableModule,	"<<endl;
	cout<<"  MatPaginatorModule	"<<endl;
	cout<<"} from '@angular/material';	"<<endl;
	cout<<"	"<<endl;
	cout<<"@NgModule({	"<<endl;
	cout<<"  declarations: ["<<tableUppercase<<"Component, "<<tableUppercase<<"Dialog],	"<<endl;
	cout<<"  imports: [	"<<endl;
	cout<<"    TransferHttpCacheModule,	"<<endl;
	cout<<"    CommonModule,	"<<endl;
	cout<<"    RouterModule.forChild([	"<<endl;
	cout<<"      {	"<<endl;
	cout<<"        path: '', component: "<<tableUppercase<<"Component, children: [	"<<endl;
	cout<<"        ],	"<<endl;
	cout<<"      }	"<<endl;
	cout<<"    ]),	"<<endl;
	cout<<"    FormsModule,	"<<endl;
	cout<<"    ReactiveFormsModule,	"<<endl;
	cout<<"	"<<endl;
	cout<<"    MatInputModule,	"<<endl;
	cout<<"    MatDatepickerModule,	"<<endl;
	cout<<"    MatNativeDateModule,	"<<endl;
	cout<<"    MatSelectModule,	"<<endl;
	cout<<"    MatRadioModule,	"<<endl;
	cout<<"    MatDialogModule,	"<<endl;
	cout<<"    MatCardModule,	"<<endl;
	cout<<"    MatSortModule,	"<<endl;
	cout<<"    MatTableModule,	"<<endl;
	cout<<"    MatPaginatorModule,	"<<endl;
	cout<<"  ],	"<<endl;
	cout<<"  entryComponents: ["<<tableUppercase<<"Dialog]	"<<endl;
	cout<<"})	"<<endl;
	cout<<"export class "<<tableUppercase<<"Module { }	"<<endl;

}

int main(){
	ifstream cin ("input-angular.txt");
	
	string s,temp,table, param1, param2, param3, param4;
	vector<string> result;
	int n,pos,ans=10;
	cin>>n;
	while(n--){
		cin>>s; 
		table = s.substr(0,s.find("(")); 
		
		char firstUpper = toupper(table[0]);
		string tableUppercase =  firstUpper + table.substr(1);
		
		temp = s.substr(s.find("(") +1 ,s.length()-1);
		result = split(temp,",");
		
		// create directory
		int check; 
	    string dirname = table;  
	    mkdir(dirname.c_str());    
		
		// gen dialog html 
		genDialogHtml(table, tableUppercase, result);
		
		// gen html 
		genHtml(table, tableUppercase, result);
		
		// gen css
		genCss(table, tableUppercase, result); 
		
		// gen component
		genComponent(table, tableUppercase, result);
		
		// gen module
		genModule(table, tableUppercase, result);
		
	} 
	return 0;
}

