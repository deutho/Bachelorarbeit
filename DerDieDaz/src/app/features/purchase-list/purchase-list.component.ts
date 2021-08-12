import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {

  constructor(private afs: FirestoreDataService, private app: AppService) { }

  purchases: any[] = [];

  ngOnInit() {
    this.app.myHeader("Einkaufsliste")

   this.purchases = this.afs.getPurchasesFromTecher();
   console.log(this.purchases)

  }

}
