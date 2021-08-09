import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/models/users.model';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-classgoal',
  templateUrl: './classgoal.component.html',
  styleUrls: ['./classgoal.component.css']
})
export class ClassgoalComponent implements OnInit {

  currentUser;
  teacher: Teacher;

  constructor(private app: AppService, private afs: FirestoreDataService) { }

  async ngOnInit() {
    this.app.myHeader("Klassenziel")
    this.currentUser = this.afs.getUser
    console.log(this.currentUser)
    this.teacher = await this.afs.getUserPerID(this.currentUser.parent)
    console.log(this.teacher[0])
  }

}
