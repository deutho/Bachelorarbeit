import { Component, OnDestroy, OnInit } from '@angular/core';
import { Teacher } from 'src/app/models/users.model';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-classgoal',
  templateUrl: './classgoal.component.html',
  styleUrls: ['./classgoal.component.css']
})
export class ClassgoalComponent implements OnInit, OnDestroy {

  currentUserSubscription;
  currentUser;
  teacher;
  goal: string;

  constructor(private app: AppService, private afs: FirestoreDataService) { }


  async ngOnInit() {
    this.app.myHeader("Klassenziel")
    this.currentUserSubscription = this.afs.currentUserStatus.subscribe(data => {
      this.currentUser = data
      if(data != null){
        this.initialize()
      }
    })   
  
  }

  async initialize(){
    this.teacher = (await this.afs.getUserPerID(this.currentUser.parent))[0]
    // this.teacher.classtargets.forEach((value, key) => {
    //   console.log(key + " " + value)
    // })
    // console.log(this.teacher.classtargets.size)
    // for(let key of this.teacher.classtargets.keys()) {
    //   console.log(key)
    // }
    console.log(this.teacher.classtargets.keys())
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
