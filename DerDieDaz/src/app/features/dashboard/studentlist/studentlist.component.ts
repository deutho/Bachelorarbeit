import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/users.model';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-studentlist',
  templateUrl: './studentlist.component.html',
  styleUrls: ['./studentlist.component.css']
})
export class StudentlistComponent implements OnInit, OnDestroy {

  currentUser: User;
  studentList: User[];
  loading: boolean;
  subscription;


  constructor(private afs: FirestoreDataService, private auth: AuthService, private app: AppService) { }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

 async ngOnInit() {
   //Get the current teacher
   this.app.myHeader("Schülerliste")
   this.subscription = this.afs.currentUserStatus.subscribe(data => {
     this.currentUser = data
     this.getStudents();
    });

   
   
  }

  async getStudents() {
    this.loading = true;
    
    //get the students
    await this.afs.getChildernUserByParentID(this.currentUser.uid).then(data => this.studentList = data);
    console.log(this.studentList);

    this.studentList.sort((a, b) => {
      if (a.lastname < b.lastname) {return -1;}
      if (a.lastname > b.lastname) {return 1;}
      return 0;
    });

    for(var i = 0; i<this.studentList.length; i++){
      this.studentList[i].username = this.studentList[i].username.substring(0,this.studentList[i].username.length - 13)
    }

    this.loading = false;

  }
  

}
