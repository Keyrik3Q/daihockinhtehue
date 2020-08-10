// import { Component, OnInit, Input } from '@angular/core'
// import { ApiService } from '../../api-service/api.service';

// @Component({
//   selector: 'print-ticket',
//   templateUrl: './print-ticket.component.html',
//   styleUrls: ['./print-ticket.component.scss']
// })
// export class PrintTicketComponent implements OnInit {
//   @Input() ticket: any;

//   elementType: 'url' | 'canvas' | 'img' = 'url';
//   value: string = 'phuong';

//   // for input control 
//   train: any;
//   trip: any;
//   user: any;
//   age: number = 0;

//   constructor(private api: ApiService) {
//     // init data user  
//     this.train = {
//       id: 1,
//       name: ''
//     };

//     this.trip = {
//       id: 1,
//       startTimeTrain: '',
//       endTimeTrain: '',
//       totalSeat: '',
//       typeTicket: 0
//     };

//     this.user = {
//       company: this.api.company,
//       id: 1,
//       name: '',
//       phone: '',
//       cmnd: '',
//       born: '',
//       address: ''
//     };
//   }


//   ngOnInit() {
//     this.value = this.ticket.id + '';

//     // load data train
//     this.findDataTrain();

//     // load data trip
//     this.findDataTrip();

//     // load data user
//     this.findDataUser();
//   }

//   /**
//    * find Data Train
//    */
//   findDataTrain() {
//     console.log('findDataTrain', { 'pk': this.ticket.train });

//     this.api.excuteAllByWhat({ 'pk': this.ticket.train }, 'findDataTrain').subscribe(data => {
//       if (data) {
//         this.train = this.api.convertToData(data)[0];
//       }
//     })
//   }

//   /**
//    * find Data user
//    */
//   findDataUser() {
//     this.api.excuteAllByWhat({ 'pk': this.ticket.user, company: this.api.company }, 'findDataUser')
//       .subscribe(data => {
//         if (data) {
//           this.user = this.api.convertToData(data)[0];

//           // tính tuổi
//           this.age = (new Date()).getFullYear() - (new Date(this.user.born)).getFullYear();
//         }
//       })
//   }

//   /**
//    * find Data trip
//    */
//   findDataTrip() {
//     this.api.excuteAllByWhat({ 'pk': this.ticket.trip, company: this.api.company }, 'findDataTrip')
//       .subscribe(data => {
//         if (data) {
//           this.trip = this.api.convertToData(data)[0];
//         }
//       })
//   }

// }
