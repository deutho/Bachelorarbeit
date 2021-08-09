import { Component, OnInit } from '@angular/core';
import { Challange } from 'src/app/models/challange.model';
import { User } from 'src/app/models/users.model';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-challanges',
  templateUrl: './challanges.component.html',
  styleUrls: ['./challanges.component.css']
})
export class ChallangesComponent implements OnInit {
  currentUser: User;
  challanges: Challange[];

  constructor(private afs: FirestoreDataService) { }

  async ngOnInit(){
    await this.afs.getCurrentUser().then(data => this.currentUser = data[0]);
    this.challanges = await this.afs.getAllChallanges();
    console.log(this.challanges)
  }

  

}
