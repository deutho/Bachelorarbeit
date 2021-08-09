import { Component, OnDestroy, OnInit } from '@angular/core';
import { Student, Teacher } from 'src/app/models/users.model';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-classgoal',
  templateUrl: './classgoal.component.html',
  styleUrls: ['./classgoal.component.css']
})
export class ClassgoalComponent implements OnInit, OnDestroy {

  currentUserSubscription;
  currentUser: Student;
  teacher: Teacher;
  goal: string;

  constructor(private app: AppService, private afs: FirestoreDataService) { }


  async ngOnInit() {
    this.app.myHeader("Klassenziel")
    this.currentUserSubscription = this.afs.currentUserStatus.subscribe(data => {
      this.currentUser = data as Student
      if(data != null){
        this.initialize()
      }
    })   
  
  }

  async initialize(){
    this.teacher = (await this.afs.getUserPerID(this.currentUser.parent))[0]
   
    for (const [key, value] of Object.entries(this.teacher.classtargets)) { 
      console.log(key, value);
  }


  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
