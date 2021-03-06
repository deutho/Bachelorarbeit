import { Component, OnDestroy, OnInit } from '@angular/core';
import { Challange } from 'src/app/models/challange.model';
import { User } from 'src/app/models/users.model';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-challanges',
  templateUrl: './challanges.component.html',
  styleUrls: ['./challanges.component.css']
})
export class ChallangesComponent implements OnInit, OnDestroy {
  currentUser;
  challanges: Challange[];
  subscription;

  constructor(private afs: FirestoreDataService, private app: AppService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(){
    this.app.myHeader("Herausforderungen")

    this.subscription = this.afs.currentUserStatus.subscribe(data => this.currentUser = data);
    this.challanges = await this.afs.getAllChallanges();
    console.log(this.challanges)
    
  }

  

}
