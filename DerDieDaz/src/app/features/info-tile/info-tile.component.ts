import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from 'src/app/alert/alert.component';
import { AlertService } from 'src/app/services/alertService';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'info-tile',
  templateUrl: './info-tile.component.html',
  styleUrls: ['./info-tile.component.css']
})
export class InfoTileComponent implements OnInit, OnDestroy {
  @Input() public header: string;
  @Input() public image: string;
  @Input() public descriptionFront: string;
  @Input() public descriptionBack: string;
  @Input() public buttonText: string;
  @Input() public buttonAction: string;
  @Input() public goldBorder: boolean = false;
  @Input() public alreadyBought: boolean = false;
  @Input() public rewarduid: string
  @Input() public shopItemID: string;
  loaded = false
  height = 0;
  currentUser: any;
  usersubscription


  constructor(private afs: FirestoreDataService, private alert: AlertService, private router: Router, private userservice: UserService) {
    
   }
  ngOnDestroy(): void {
    this.usersubscription.unsubscribe();
  }

  async ngOnInit() {
    this.loaded = false
    this.usersubscription = this.afs.currentUserStatus.subscribe(data => this.currentUser = data);
    console.log(this.buttonText)
  }

  async buttonClick(buttonAction){
    if(buttonAction =="print") {
      console.log("click")
      console.log(this.header)      
    }
    else if(buttonAction =="setAvatar") {
      this.afs.updateUserPicture(this.image, this.currentUser.uid)
      this.alert.success("Avatar wurde gesetzt")
    }
    else if(buttonAction =="shake") {
      this.alert.error("Avatar wurde noch nicht freigeschalten")
    }
    else if(buttonAction =="soldOut") {
      this.alert.error("Du hast diese Belohnung bereits gekauft. Warte bis dir deine Lehrerin diese übergibt.")
    }
    else if(buttonAction =="buy"){
      if(this.currentUser.role == 2){
        this.alert.error("Als Lehrkraft kann man keine Belohnungen kaufen.")
      }
      else if(this.header == "Hausübungsgutschein"){
        this.userservice.purchaseReward(this.header, "Hausübungsgutschein-"+this.currentUser.uid, this.buttonText, this.currentUser).then((message) => {
          this.alert.success(message);
        }).catch((message) => {
          this.alert.error(message)
        });
      }
      else{
        this.userservice.purchaseReward(this.header, this.shopItemID, this.buttonText, this.currentUser).then((message) => {
          this.alert.success(message);
        }).catch((message) => {
          this.alert.error(message)
        });

      }
    }
    else if(buttonAction == "createReward"){
      // redirect? modal? sicke aufwendige drehkarte?
      this.router.navigate(['createReward'])
    }
    else if(buttonAction == "toggleHomeworkVoucher"){
      this.afs.toggleHomeWorkVoucherStatus(this.currentUser.activatedHomeworkVoucher, this.currentUser.uid)
    }
  }

}
