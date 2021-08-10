import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.css']
})
export class AvatarSelectionComponent implements OnInit {

  currentUser;
  avatars;
  challanges;

  constructor(private afs: FirestoreDataService, private app: AppService) { }

  async ngOnInit() {
    this.app.myHeader("Avatarwahl")
    this.afs.currentUserStatus.subscribe(data => this.currentUser = data);
    this.avatars = await this.afs.getAllAvatars();
    this.challanges = await this.afs.getAllChallanges();
  }

}
