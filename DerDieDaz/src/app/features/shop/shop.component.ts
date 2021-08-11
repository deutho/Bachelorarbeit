import { Component, OnDestroy, OnInit } from '@angular/core';
import { ObjectUnsubscribedError } from 'rxjs';
import { Purchase } from 'src/app/models/purchase.model';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import { HighlightSpanKind } from 'typescript';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {

  shopitems;
  currentUser;
  currentUserSubscription;
  purchaseSubscription;
  parent;
  itemNames = [];
  itemImages = [];
  itemPrices = [];
  fullArray = [];
  purchaes: Purchase[] = []
  objects: string[] = []

  constructor(private afs: FirestoreDataService, private app: AppService) { }
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.purchaseSubscription.unsubscribe();
  }

  async ngOnInit(){
    this.app.myHeader("Shop")

    this.currentUserSubscription = this.afs.currentUserStatus.subscribe(async data => {
      this.currentUser = data
      if(data != null){

        if (this.currentUser.role == 3) {
          this.purchaseSubscription = this.afs.purchasesStatus.subscribe((data) => {
            this.purchaes = data;
            this.objects = [];
            if (this.purchaes != null) {
              this.purchaes.forEach((purchase) => {
                this.objects.push(purchase.objectID);
              });
              console.log(this.objects)
            }
          });
        }
        this.parent = (await this.afs.getUserPerID(this.currentUser.parent))[0]
        if(parent != null){
          this.initialize()
        }
      }
    })   
  
  }

  async initialize(){
    this.itemNames = [];
    this.itemImages = [];
    this.itemPrices = [];
    if(this.parent.individualtargets == undefined) this.parent = this.currentUser
    for (const [head, map] of Object.entries(this.parent.individualtargets)) { 
      for (const [key, value] of Object.entries(this.parent.individualtargets[head])) {
        // tempKeys.push(key)
        // tempValues.push(value)
        if(key == "object"){
          this.itemNames.push(value)
        }
        else if(key == "imageURL"){
          this.itemImages.push(value)
        }
        else if(key == "price"){
          this.itemPrices.push(value)
        }   
      }
    }

    for( var i=0; i<this.itemNames.length; i++ ) {
      this.fullArray.push( [] );
    }
    for(let i = 0; i<this.itemNames.length; i++){
      this.fullArray[i].push(this.itemNames[i],this.itemImages[i],this.itemPrices[i])
    }
    this.fullArray.sort(this.sortFunction);
    console.log(this.fullArray)   
  console.log("namen:")
  console.log(this.itemImages)
  console.log(this.itemNames)
  console.log(this.objects.indexOf(this.itemNames[0]))
  console.log(this.objects.indexOf(this.itemNames[1]))

  
  }

  sortFunction(a, b) {
    if (a[2] === b[2]) {
        return 0;
    }
    else {
        return (a[2] < b[2]) ? 1 : -1;
    }
}

}
