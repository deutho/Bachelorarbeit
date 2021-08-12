import { Component, OnDestroy, OnInit } from '@angular/core';
import { ObjectUnsubscribedError } from 'rxjs';
import { Purchase } from 'src/app/models/purchase.model';
import { Reward } from 'src/app/models/reward.model';
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
  rewards: Reward[] = []
  objects: string[] = []
  itemID: any = [];

  constructor(private afs: FirestoreDataService, private app: AppService) { }
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    if (this.purchaseSubscription != null) this.purchaseSubscription.unsubscribe();
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
    // reset arrays in case user Object does change in database (starbalance changed by buying)

    this.itemNames = [];
    this.itemImages = [];
    this.itemPrices = [];
    this.itemID = [];
    // if it is a teacher, get the rewards from self, otherwise get rewards from teacher
    if(this.parent.individualtargets == undefined) this.parent = this.currentUser

    // loop through the map and collect necessary data
    for (const [head, map] of Object.entries(this.parent.individualtargets)) { 
      this.itemID.push(head);
      for (const [key, value] of Object.entries(this.parent.individualtargets[head])) {
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

    // combine all the data from the map into a two dimensional array
    this.fullArray = [];
    for(let i = 0; i<this.itemNames.length; i++){
      this.fullArray.push( [] ); //increase length
      this.fullArray[i].push(this.itemNames[i],this.itemImages[i],this.itemPrices[i], this.itemID[i]) //add data into array
    }

    // sort array by price descending and the by length of name
    this.fullArray.sort(this.sortFunction)
  }

  sortFunction(a, b) {
    // if same price sort by first letter alphabetically, else sort by price descending
    if (a[2] === b[2]) {
        return a[0][0] < b[0][0] ? -1 : 1;
    }
    else {
        return (a[2] < b[2]) ? 1 : -1;
    }
  }

  // async initialize() {
  //   if (this.currentUser.role == 3) this.rewards = this.parent.individualtargets;
  //   if (this.currentUser.role == 2) this.rewards = this.currentUser.individualtargets;

  //   this.rewards.sort((reward1, reward2) => {
  //     if (reward1.price === reward2.price) {
  //       return reward2.name < reward1.name?-1:1
  //     }else {
  //       return reward2.price - reward1.price;
  //     }
  //   });

  //}





  

}
