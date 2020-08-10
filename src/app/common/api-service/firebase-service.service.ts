// import { AngularFirestore, QueryFn } from "@angular/fire/firestore";
// import { Injectable } from "@angular/core";

// @Injectable()
// export class FirebaseService {
//     constructor(private firestore: AngularFirestore) { }

//     /**
//      * get all data of collection
//      * @param table 
//      * @param queryFn 
//      */
//     getDataFrom(table: string, queryFn?: QueryFn) {
//         if (queryFn) {
//             return this.firestore.collection(table, queryFn).snapshotChanges();
//         } else {
//             return this.firestore.collection(table).snapshotChanges();
//         }
//     }

//     /**
//      * add data to collection
//      * @param table 
//      * @param data 
//      */
//     addDataTo(table: string, data: any) {
//         return this.firestore.collection(table).add(data);
//     }

//     /**
//      * add data to collection
//      * @param table 
//      * @param data 
//      */
//     updateDataOf(table: string, data: any) {
//         this.firestore.doc(table + '/' + data.id).update(data);
//     }

//     /**
//      * add data to collection
//      * @param table 
//      * @param data 
//      */
//     deleteDataOf(table: string, id: any) {
//         this.firestore.doc(table + '/' + id).delete();
//     }

//     /**
//      * add data to collection
//      * @param table 
//      * @param data 
//      */
//     findDataById(table: string, id: any) {
//         this.firestore.doc(table + '/' + id).valueChanges();
//     }

//     /**
//      * convert data from firebase to object
//      * @param data 
//      */
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

// }