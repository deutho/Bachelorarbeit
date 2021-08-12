import { Component, OnInit } from '@angular/core';
import { Purchase } from 'src/app/models/purchase.model';
import { Student } from 'src/app/models/users.model';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import { PDFService } from 'src/app/services/pdfservice';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {

  constructor(private afs: FirestoreDataService, private app: AppService, private pdf: PDFService) { }

  purchases: any[] = [];

  ngOnInit() {
    this.app.myHeader("Einkaufsliste")
   this.purchases = this.afs.getPurchasesFromTecher();
   console.log(this.purchases)

  }

  givenOut(purchase: Purchase) {
    purchase.given = true;
    this.afs.updatePurchaseGiven(purchase);
  }

  async printVoucher(purchase: Purchase) {
    let student: Student = (await this.afs.getUserPerID(purchase.studentID))[0]
    console.log(student);
    this.pdf.generateHomeWorkVoucher(student.firstname + " " +student.lastname, student.gender);
  }

  async deletePurchase(purchase: Purchase) {
    this.afs.deletePurchaseDocument(purchase);
    this.purchases.splice(this.purchases.indexOf(purchase),1)
  }

}
