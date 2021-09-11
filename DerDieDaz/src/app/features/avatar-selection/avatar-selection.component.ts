import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.css']
})
export class AvatarSelectionComponent implements OnInit, OnDestroy {

  currentUser;
  avatars;
  challanges;
  subscription;

  constructor(private afs: FirestoreDataService, private app: AppService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit() {
    this.app.myHeader("Avatarwahl")
    this.subscription = this.afs.currentUserStatus.subscribe(data => this.currentUser = data);
    this.avatars = await this.afs.getAllAvatars();
    this.challanges = await this.afs.getAllChallanges();
  }

}
