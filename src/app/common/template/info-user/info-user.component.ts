import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { User } from '../../models/user-models';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss']
})
export class InfoUserComponent implements OnInit {
  @Input() seat: any;
  @Input() users: any[];
  @Output() confirm = new EventEmitter();
  @Input() user: User;


  // for input control
  myControl = new FormControl();
  listUser: Array<User> = [];
  filteredOptions: Observable<string[]>;

  constructor() {
    // init data user  
    this.user = { name: '', phone: '', cmnd: '', born: '', address: '' };
  }

  onValueChange() { 
    this.confirm.emit(this.user);
  }

  ngOnInit() {
    // set when click on input name will show list options
    setTimeout(() => {
      this.firstFilterValueName();
    }, 200);
  }

  /**
   * firstFilterValueName
   */
  firstFilterValueName() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  /**
   * onSelectName
   * @param user 
   */
  onSelectName() { 
    const userTemp = this.users.filter(value => value.id == this.user.name)[0];
    
    this.user.company = userTemp.company;
    this.user.id = userTemp.id;
    this.user.name = userTemp.name;
    this.user.nameTemp = userTemp.nameTemp;
    this.user.phone = userTemp.phone;
    this.user.born = userTemp.born;
    this.user.address = userTemp.address;
    this.user.cmnd = userTemp.cmnd;

    // emit value to orther
    this.onValueChange();
  }


  /**
   * _filter
   * @param value 
   */
  private _filter(value: string): string[] {
    let filterValue = (value + '').toLowerCase();

    let dataFilter = [];

    // clear data 
    filterValue = this.cleanAccents(filterValue);

    // fillter by name 
    dataFilter = this.users.filter(option => option.name.toLowerCase().includes(filterValue));

    // fillter by cmnd 
    if (dataFilter.length == 0) {
      dataFilter = this.users.filter(option => option.cmnd.toLowerCase().includes(filterValue));
    }

    // fillter by phone
    if (dataFilter.length == 0) {
      dataFilter = this.users.filter(option => option.phone.toLowerCase().includes(filterValue));
    }  

    return dataFilter;
  }

  /**
    * bỏ dấu tiếng việt để search
  */
  private cleanAccents(str: string): string {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Combining Diacritical Marks
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)

    return str;
  }
}
