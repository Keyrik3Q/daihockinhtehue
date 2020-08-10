import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog'; 
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from 'src/app/common/api-service/api.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-g-manage-file',
  templateUrl: './g-manage-file.component.html',
  styleUrls: ['./g-manage-file.component.scss']
})
export class GManageFileComponent implements OnInit, OnDestroy {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  files = [];

  subscription: Subscription[] = [];

  @ViewChild('data', { read: ElementRef, static: true })
    public data: ElementRef;
    
  constructor(
    public dialogRef: MatDialogRef<GManageFileComponent>,
    @Inject(MAT_DIALOG_DATA) public input: GManageFileComponent,
    public dialog: MatDialog, private uploadService: ApiService, private api: ApiService) {
  }

  //upload File
  imgURL: any;
  imgURLBanner: any;
  fileToUpload: File = null;
  type: number;

  // url logo
  public imagePath;
  public message: string;
  myUrl: string = "";
  myUrlBanner: string = "";
  isUpdate = false;
  isUpdateBanner = false;

  // get time save image
  today = new Date();
  date =
    this.today.getFullYear() +
    "-" +
    (this.today.getMonth() + 1 > 9
      ? this.today.getMonth() + 1
      : "0" + (this.today.getMonth() + 1)) +
    "-" +
    (this.today.getDate() > 9
      ? this.today.getDate()
      : "0" + this.today.getDate());
  time =
    (this.today.getHours() > 9
      ? this.today.getHours()
      : "0" + this.today.getHours()) +
    "-" +
    (this.today.getMinutes() > 9
      ? this.today.getMinutes()
      : "0" + this.today.getMinutes()) +
    "-" +
    (this.today.getSeconds() > 9
      ? this.today.getSeconds()
      : "0" + this.today.getSeconds());
  dateTime = this.date + "-" + this.time;

  /**
   * ngOnInit
   */
  ngOnInit() {
    
  }

  /**
   * on click
   */
  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }


  

  private uploadFiles() {
    this.fileUpload.nativeElement.value = "";
    this.files.forEach((file) => {
      this.uploadFile(file);
    });
  }

  /**
   * upload file
   */
  uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file.data);
    formData.append("date1", this.dateTime);
    this.myUrl =
      "http://hoctienganhphanxa.com/hce/hce-api/src/Controller/assets/images/" +
      this.dateTime +
      file.data.name;
    // this.company.logo = this.myUrl; 
    file.inProgress = true;
    this.uploadService
      .upload(formData)
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          file.inProgress = false;
          return of(`${file.data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === "object") {
        }
      });
  }

  //preview on upload
  preview(files) {
    this.isUpdate = true;
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  } 
  //End Upload File

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


}
