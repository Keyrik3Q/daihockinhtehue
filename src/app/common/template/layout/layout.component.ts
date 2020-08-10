import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SeatsLayout } from '../../models/seat-layout.model';


@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @Input() seatsLayout: SeatsLayout;
  @Output() confirm = new EventEmitter();
  @Output() selectSeat = new EventEmitter();
  rows = new Array();

  constructor() { }

  ngOnInit() {
    this.createSetMap();
  }

  /**
   * createSetMap
   */
  createSetMap() {
    var rows = new Array()
    var seatsInARow = new Array()
    if (this.seatsLayout != undefined && this.seatsLayout.hasOwnProperty('totalRows')) {
      if (this.seatsLayout.seatNaming = 'rowType') {
        const sizeOfSeat = Number(this.seatsLayout.totalRows) * Number(this.seatsLayout.seatsPerRow);
        for (let i = 1; i <= sizeOfSeat; i++) {
          // 001
          if (i < 10) {
            seatsInARow.push('00' + i);
          } else {
            // 011
            if (i < 100) {
              seatsInARow.push('0' + i);
            } else {
              // 101
              seatsInARow.push(i.toString());
            }
          }

          // break seat
          if (i % Number(this.seatsLayout.seatsPerRow) == 0) {
            rows.push(seatsInARow);
            seatsInARow = new Array();
          }
        }
      }
    }
    
    // if train is seatsLayout.totalRows = 17
    if(this.seatsLayout.totalRows == 18){
      seatsInARow = new Array();
      seatsInARow.push('137');
      seatsInARow.push('138');
      seatsInARow.push('139');
      seatsInARow.push('000'); 
      seatsInARow.push('000'); 
      seatsInARow.push('000'); 
      seatsInARow.push('000'); 
      seatsInARow.push('000'); 
      rows.pop();
      rows.push(seatsInARow);
    }
    this.rows = rows;
  }

  /**
   * done
   */
  done() {
    this.confirm.emit(this.seatsLayout.booked);
  }

  /**
   * Book seat
   * @param seat 
   */
  seatAction(seat) {
    if (this.seatsLayout.booked.indexOf(seat) >= 0) {
      this.seatsLayout.booked = this.seatsLayout.booked.filter(bookedSeat => {
        return bookedSeat != seat;
      })
    }
    else {
      this.seatsLayout.booked.push(seat);
    }

    this.selectSeat.emit(this.seatsLayout.booked);
  }
}
