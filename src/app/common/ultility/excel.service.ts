// import { Injectable } from '@angular/core';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';

// // https://www.npmjs.com/package/xlsx
// @Injectable()
// export class ExcelService {
//     constructor() { }
//     public exportAsExcelFile(json: any[], excelFileName: string): void {
//         const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
//         const workbook: XLSX.WorkBook = { Sheets: { 'PinkWays': worksheet }, SheetNames: ['PinkWays'] };
//         const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//         this.saveAsExcelFile(excelBuffer, excelFileName);
//     }

//     private saveAsExcelFile(buffer: any, fileName: string): void {
//         const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
//         FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
//     }

//     private readFileExcel() {
//         XLSX.readFile('');
//     }

//     /**
//      * Export file excel sample create trip
//      */
//     sampleCreateTrip(): void {
//         const data = [{
//             train: '0',
//             start_date: '2019-09-26',
//             start_time_train: '09:00:00',
//             end_time_train: '09:30:00',
//             type_ticket: '0',
//             price_origin: 150000,
//             price: 150000
//         }];

//         this.exportAsExcelFile(data, 'Sample-Create-Trip');
//     }

//     // onFileChange(evt: any) {
//     //     /* wire up file reader */
//     //     const target: DataTransfer = <DataTransfer>(evt.target);
//     //     if (target.files.length !== 1) throw new Error('Cannot use multiple files');
//     //     const reader: FileReader = new FileReader();
//     //     reader.onload = (e: any) => {
//     //         /* read workbook */
//     //         const bstr: string = e.target.result;
//     //         const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

//     //         /* grab first sheet */
//     //         const wsname: string = wb.SheetNames[0];
//     //         const ws: XLSX.WorkSheet = wb.Sheets[wsname];

//     //         /* save data */
//     //         this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
//     //     };
//     //     reader.readAsBinaryString(target.files[0]);
//     // }

//     // export(): void {
//     //     /* generate worksheet */
//     //     const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

//     //     /* generate workbook and add the worksheet */
//     //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
//     //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

//     //     /* save to file */
//     //     XLSX.writeFile(wb, this.fileName);
//     // }
// }