// import { AngularFirestore, QueryFn } from "@angular/fire/firestore";
// import { FirebaseService } from "./firebase-service.service";
// import { docJoin } from './doc-join';
// import { shareReplay } from 'rxjs/operators';
// import { leftJoin, leftJoinDocument, leftJoinDocumentWithQuery } from './collection-join';

// import { Injectable } from "@angular/core";

// @Injectable()
// export class CrudFirebaseService {
//     constructor(private fb: FirebaseService, private afs: AngularFirestore) { }

//     /**
//      * scrollTo
//      */
//     scrollTo(destination) {
//         const element = document.querySelector("#" + destination);
//         if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     }

//     /**
//     * convert data from firebase to object
//     * @param data 
//     */
//     convertData(data: any) {
//         let result = [];
//         data.forEach(item => {
//             result.push(
//                 {
//                     id: item.payload.doc.id,
//                     ...item.payload.doc.data()
//                 }
//             )
//         });
//         return result;
//     }

//     // -10 thông tin của khách hàng đi xe
//     // user(id, username, email, phone, address, level) 

//     // -20 loại xe
//     // car(id, name, image) 

//     // -30 thông tin của tài xế đi xe
//     // driver(id, idCompany, username, fullname, password, cmnd, phone, address, experience, image)

//     // -40 thông tin chuyến đi của tài xế
//     // trip(id, idDriver, type[xe đi ké hay xe quay đầu],fromLocation, destLocation,fromCenter,destCenter, startDate, endDate, startTime, endTime, price, numberSeat)

//     // -50 các quy định đi xe như có nhạc, có hút thuốc hay không, có điều hòa hay không
//     // regulation(id, idTrip, name)

//     // -60 thông tin vé xe
//     // ticket(id, idUser, idTrip, startDate, endDate, status[đã dùng hay chưa, hoăc hủy], type[vé thanh toán rồi, vé online thanh toán sau], price,) 

//     // -70 đánh giá của khách hàng với tài xế trong chuyến đi nào đó
//     // comment(id, idTrip, idDriver, idUser, star(1->5), message, feedback)

//     // -80 Khuyến mãi với các chuyến đi khi thanh toán thì sẽ giảm giá
//     // reward(id, percent, maxPrice(áp dụng với chuyến đi tối đa bao nhiêu tiền), startDate, endDate, status(đã dùng hay chưa))

//     // -90 Thông tin công ty vận tải muốn tham gia
//     // company(id, name, phone, address, startDate, endDate, status(còn hoạt động hay không))     

//     // 100 - common 
//     // history(id, idCompany, modDate, userId, sqlQuery, action) => sẻ được implement trong lúc call api  


//     //******************user************************
//     // user(id,username,email,phone,address,level)
//     //******************user************************
//     // user(id,username,email,phone,address,level)
//     /**	
//       * Get all data from user
//       */
//     public getAllDataFromUser() {
//         return this.fb.getDataFrom('user');
//     }

//     /**	
//      * Insert data to user
//      * @param data 	
//      */
//     public insertDataToUser(data) {
//         this.fb.addDataTo('user', data);
//     }

//     /**	
//      * Update data user
//      * @param data 	
//      */
//     public updateDataUser(data) {
//         this.fb.updateDataOf('user', data);
//     }

//     /**	
//      * Delete data of user
//      * @param id 	
//      */
//     public deleteDataUser(id) {
//         this.fb.deleteDataOf('user', id);
//     }

//     /**	
//      * Find data user by id	
//      * @param id 	
//      */
//     public findDataUserById(id) {
//         this.fb.findDataById('user', id);
//     }

//     /**	
//      * Find data user by id	
//      * @param id 	
//      */
//     public findDataUserByEmail(email) {
//         let q: QueryFn;
//         q = ref => ref.where('email', '==', email)
//         return this.fb.getDataFrom('user', q);
//     }



//     //******************car************************
//     // car(id,name,image)
//     /**	
//       * Get all data from car
//       */
//     public getAllDataFromCar() {
//         return this.fb.getDataFrom('car');
//     }

//     /**	
//      * Insert data to car
//      * @param data 	
//      */
//     public insertDataToCar(data) {
//         this.fb.addDataTo('car', data);
//     }

//     /**	
//      * Update data car
//      * @param data 	
//      */
//     public updateDataCar(data) {
//         this.fb.updateDataOf('car', data);
//     }

//     /**	
//      * Delete data of car
//      * @param id 	
//      */
//     public deleteDataCar(id) {
//         this.fb.deleteDataOf('car', id);
//     }

//     /**	
//      * Find data car by id	
//      * @param id 	
//      */
//     public findDataCarById(id) {
//         this.fb.findDataById('car', id);
//     }

//     //******************driver************************
//     // driver(id,idCompany,username,password,cmnd,phone,address,experience,image)
//     /**	
//       * Get all data from driver
//       */
//     public getAllDataFromDriver() {
//         return this.fb.getDataFrom('driver');
//     }

//     /**	
//      * Insert data to driver
//      * @param data 	
//      */
//     public insertDataToDriver(data) {
//         this.fb.addDataTo('driver', data);
//     }

//     /**	
//      * Update data driver
//      * @param data 	
//      */
//     public updateDataDriver(data) {
//         this.fb.updateDataOf('driver', data);
//     }

//     /**	
//      * Delete data of driver
//      * @param id 	
//      */
//     public deleteDataDriver(id) {
//         this.fb.deleteDataOf('driver', id);
//     }

//     /**	
//      * Find data driver by id	
//      * @param id 	
//      */
//     public findDataDriverById(id) {
//         this.fb.findDataById('driver', id);
//     }

//     //******************trip************************
//     // trip(id,idDriver,type,fromLocation,destLocation,fromCenter,destCenter,startDate,endDate,startTime,endTime,price,numberSeat)
//     /**	
//       * Get all data from trip
//       */
//     public getAllDataFromTrip() {
//         return this.fb.getDataFrom('trip');
//     }

//     /**	
//      * Insert data to trip
//      * @param data 	
//      */
//     public insertDataToTrip(data) {
//         this.fb.addDataTo('trip', data);
//     }

//     /**	
//      * Update data trip
//      * @param data 	
//      */
//     public updateDataTrip(data) {
//         this.fb.updateDataOf('trip', data);
//     }

//     /**	
//      * Delete data of trip
//      * @param id 	
//      */
//     public deleteDataTrip(id) {
//         this.fb.deleteDataOf('trip', id);
//     }

//     /**	
//      * Find data trip by id	
//      * @param id 	
//      */
//     public findDataTripById(id) {
//         this.fb.findDataById('trip', id);
//     }

//     /**
//      * get data one trip join with driver and comment
//      */
//     public getDataTripById(id) {
//         return this.afs
//             .doc('trip/' + id)
//             .valueChanges()
//             .pipe(
//                 docJoin(this.afs, { idDriver: 'driver' }),
//                 docJoin(this.afs, { idComment: 'comment' }),
//                 shareReplay(1)
//             );
//     }

//     /**
//      * get data trip join with driver and comment
//      */
//     public getDataSeachTrip(param) {
//         let q: QueryFn;
//         q = ref => ref.where('startDate', '==', param.startDate)
//             .where('fromLocation', '==', param.fromLocation)
//             .where('destLocation', '==', param.destLocation);

//         return this.afs
//             .collection('trip', q)
//             .valueChanges()
//             .pipe(
//                 leftJoinDocumentWithQuery(this.afs, 'idDriver', 'driver'),
//                 leftJoinDocumentWithQuery(this.afs, 'comment', 'comment'),
//                 shareReplay(1)
//             );
//     }

//     //******************regulation************************
//     // regulation(id,idTrip,name)
//     /**	
//       * Get all data from regulation
//       */
//     public getAllDataFromRegulation() {
//         return this.fb.getDataFrom('regulation');
//     }

//     /**	
//      * Insert data to regulation
//      * @param data 	
//      */
//     public insertDataToRegulation(data) {
//         this.fb.addDataTo('regulation', data);
//     }

//     /**	
//      * Update data regulation
//      * @param data 	
//      */
//     public updateDataRegulation(data) {
//         this.fb.updateDataOf('regulation', data);
//     }

//     /**	
//      * Delete data of regulation
//      * @param id 	
//      */
//     public deleteDataRegulation(id) {
//         this.fb.deleteDataOf('regulation', id);
//     }

//     /**	
//      * Find data regulation by id	
//      * @param id 	
//      */
//     public findDataRegulationById(id) {
//         this.fb.findDataById('regulation', id);
//     }

//     //******************ticket************************
//     // ticket(id,idUser,idTrip,startDate,endDate,status,type,price)
//     /**	
//       * Get all data from ticket
//       */
//     public getAllDataFromTicket() {
//         return this.fb.getDataFrom('ticket');
//     }

//     /**	
//      * Insert data to ticket
//      * @param data 	
//      */
//     public insertDataToTicket(data) {
//         this.fb.addDataTo('ticket', data);
//     }

//     /**	
//      * Update data ticket
//      * @param data 	
//      */
//     public updateDataTicket(data) {
//         this.fb.updateDataOf('ticket', data);
//     }

//     /**	
//      * Delete data of ticket
//      * @param id 	
//      */
//     public deleteDataTicket(id) {
//         this.fb.deleteDataOf('ticket', id);
//     }

//     /**	
//      * Find data ticket by id	
//      * @param id 	
//      */
//     public findDataTicketById(id) {
//         this.fb.findDataById('ticket', id);
//     }

//     //******************comment************************
//     // comment(id,idTrip,idDriver,star,message,feedback)
//     /**	
//       * Get all data from comment
//       */
//     public getAllDataFromComment() {
//         return this.fb.getDataFrom('comment');
//     }

//     /**	
//      * Insert data to comment
//      * @param data 	
//      */
//     public insertDataToComment(data) {
//         this.fb.addDataTo('comment', data);
//     }

//     /**	
//      * Update data comment
//      * @param data 	
//      */
//     public updateDataComment(data) {
//         this.fb.updateDataOf('comment', data);
//     }

//     /**	
//      * Delete data of comment
//      * @param id 	
//      */
//     public deleteDataComment(id) {
//         this.fb.deleteDataOf('comment', id);
//     }

//     /**	
//      * Find data comment by id	
//      * @param id 	
//      */
//     public findDataCommentById(id) {
//         this.fb.findDataById('comment', id);
//     }

//     //******************reward************************
//     // reward(id,percent,maxPrice,startDate,endDate,status)
//     /**	
//       * Get all data from reward
//       */
//     public getAllDataFromReward() {
//         return this.fb.getDataFrom('reward');
//     }

//     /**	
//      * Insert data to reward
//      * @param data 	
//      */
//     public insertDataToReward(data) {
//         this.fb.addDataTo('reward', data);
//     }

//     /**	
//      * Update data reward
//      * @param data 	
//      */
//     public updateDataReward(data) {
//         this.fb.updateDataOf('reward', data);
//     }

//     /**	
//      * Delete data of reward
//      * @param id 	
//      */
//     public deleteDataReward(id) {
//         this.fb.deleteDataOf('reward', id);
//     }

//     /**	
//      * Find data reward by id	
//      * @param id 	
//      */
//     public findDataRewardById(id) {
//         this.fb.findDataById('reward', id);
//     }

//     //******************company************************
//     // company(id,name,phone,address,startDate,endDate,status)
//     /**	
//       * Get all data from company
//       */
//     public getAllDataFromCompany() {
//         return this.fb.getDataFrom('company');
//     }

//     /**	
//      * Insert data to company
//      * @param data 	
//      */
//     public insertDataToCompany(data) {
//         this.fb.addDataTo('company', data);
//     }

//     /**	
//      * Update data company
//      * @param data 	
//      */
//     public updateDataCompany(data) {
//         this.fb.updateDataOf('company', data);
//     }

//     /**	
//      * Delete data of company
//      * @param id 	
//      */
//     public deleteDataCompany(id) {
//         this.fb.deleteDataOf('company', id);
//     }

//     /**	
//      * Find data company by id	
//      * @param id 	
//      */
//     public findDataCompanyById(id) {
//         this.fb.findDataById('company', id);
//     }

//     //******************history************************
//     // history(id,idCompany,modDate,userId,sqlQuery,action)
//     /**	
//       * Get all data from history
//       */
//     public getAllDataFromHistory() {
//         return this.fb.getDataFrom('history');
//     }

//     /**	
//      * Insert data to history
//      * @param data 	
//      */
//     public insertDataToHistory(data) {
//         this.fb.addDataTo('history', data);
//     }

//     /**	
//      * Update data history
//      * @param data 	
//      */
//     public updateDataHistory(data) {
//         this.fb.updateDataOf('history', data);
//     }

//     /**	
//      * Delete data of history
//      * @param id 	
//      */
//     public deleteDataHistory(id) {
//         this.fb.deleteDataOf('history', id);
//     }

//     /**	
//      * Find data history by id	
//      * @param id 	
//      */
//     public findDataHistoryById(id) {
//         this.fb.findDataById('history', id);
//     }
// }