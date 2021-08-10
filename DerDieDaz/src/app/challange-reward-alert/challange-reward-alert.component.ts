import { Component, OnInit } from '@angular/core';
import { ChallangeRewardService } from '../services/challangeRewardService';


@Component({
  selector: 'challange-reward-alert',
  templateUrl: './challange-reward-alert.component.html',
  styleUrls: ['./challange-reward-alert.component.css']
})
export class ChallangeRewardAlertComponent implements OnInit {

  message;
  header;
  image;
  buttonText;
  subscription;
  display="none";
  constructor(private challangeRewardservice: ChallangeRewardService) { }

  ngOnInit(): void {
    this.subscription = this.challangeRewardservice.getChallangeAlert()
    .subscribe(message => {
      this.message = message;
      if(this.message != undefined){
        // if rewards have been unlocked, show one after an other
        this.workOfAllRewards()
      }      
    });
  }

  workOfAllRewards() {
    if(this.message.length > 0){
      // sets values and opens modal
      this.header = this.message[this.message.length-1].header;
      this.image = this.message[this.message.length-1].image;
      this.buttonText = this.message[this.message.length-1].buttonText;
      document.getElementById("openModalButton").click()
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
}




deleteMessage(){
    // this.challangeRewardservice.clear()

    // pops one reward of the list
    this.challangeRewardservice.removeLatestReward()
}

}
