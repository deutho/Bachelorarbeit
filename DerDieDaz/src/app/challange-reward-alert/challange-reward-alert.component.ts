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
      console.log(message)
      this.message = message;
      if(this.message != undefined){
        this.header = this.message.header;
        this.image = this.message.image;
        this.buttonText = this.message.buttonText;
        document.getElementById("openModalButton").click()
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
}

deleteMessage(){
    this.challangeRewardservice.clear()
}

}
