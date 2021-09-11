import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import { Teacher, Student, User } from 'src/app/models/users.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { HostListener } from '@angular/core';
import { AppService } from 'src/app/services/app.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnDestroy {

  adduserform: FormGroup;
  formSubmitted = false;
  success;
  response;
  errorMessage = '';
  firebaseErrors;
  newUser: User;
  currentUser: User;
  roleAddingUser: Number;
  subscription;

  constructor(private fb: FormBuilder, private afs: FirestoreDataService, private auth_service: AuthService, private app: AppService) { }


  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.adduserform = this.fb.group({
      firstname:  ['', Validators.required],
      lastname:  ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.firebaseErrors = {
      'auth/user-not-found': 'Kein Account mit diesem Benutzernamen gefunden.',
      'auth/email-already-in-use': 'Dieser Benutzername wird bereits von einem anderen Nutzer verwendet.',
      'auth/invalid-email':	'Der angegebene Wert des Benutzernamens ist falsch - Symbole wie "@" dürfen nicht enthalten sein.',
      'auth/invalid-password':	'Der angegebene Wert für das Password ist ungültig. Es muss eine Zeichenfolge mit mindestens sechs Zeichen sein.',
      'auth/weak-password': 'Das Passwort muss mindestens 6 Zeichen lang sein.'
    }; // list of firebase error codes to alternate error messages


    this.app.myHeader("Schüler hinzufügen");
    
  }
  
  public async onSubmit() {   
    this.success = undefined; 
    this.formSubmitted = true;

    this.subscription = this.afs.currentUserStatus.subscribe(data => this.currentUser = data);

    console.log(this.adduserform.valid);

    if (this.adduserform.valid) {
      let firstname :string = this.adduserform.get('firstname').value
      let lastname :string = this.adduserform.get('lastname').value
      let username :string = this.adduserform.get('username').value
      let password :string = this.adduserform.get('password').value
      username = username + '@derdiedaz.at'

      if (this.currentUser.role == 1){
        var role = 2;
        var classid = "-1";
        this.newUser = <Teacher> {
          uid: "",
          username: username,
          firstname: firstname,
          lastname: lastname,
          role: role,
          parent: this.currentUser.uid,
          schoolclass: classid,
          school: "Testschule",
          avatarID: "1",
          classtargets: new Map<string, number>(),
          classtargetBalance: 0,
          classtargetAchieved: false,
          individualtargets: new Map<string, number>(),
          dailyloginreward: 50,
          gender: "MALE",
          activatedHomeworkVoucher: false,
          homeworkVoucherPrice: 100
        };
      } 
      else{
        let teacher: Teacher = this.currentUser as Teacher;
        var role = 3;
        var classid = "1A";
        this.newUser = <Student> {
          uid: "",
          username: username,
          firstname: firstname,
          lastname: lastname,
          role: role,
          parent: this.currentUser.uid,
          schoolclass: classid,
          school: "Testschule",
          avatarID: "1",
          challangesDone: [],
          starbalance: 0,
          loginStreak: 0,
          lastReward: 0, //UTC Timestamp
          lastRewardResetTime: 0,
          gameresults: [],
          totalGamesWon: 0,
          gender: "MALE"
        };
      } 

      //secondary App to Create User Without Logging out the current one
      var secondaryApp = this.auth_service.GetSecondaryFirebaseApp();

      await secondaryApp.auth().createUserWithEmailAndPassword(username, password).then(firebaseUser =>{
        this.newUser.uid = firebaseUser.user.uid;
        console.log(this.currentUser);
        console.log(this.newUser);
        this.afs.addUser(this.newUser, this.currentUser);

        secondaryApp.auth().signOut(); //Maybe not necessary - just for safety
      }).catch( (error) => {
        // registration failed 
        console.log(error.code + " \n\n" + error.message);
        this.success = false;
        this.errorMessage = this.firebaseErrors[error.code] || error.message;
      })

      if (this.newUser.role == 2) {
        this.afs.addFolderDocument(this.newUser.uid, 'root');
      }

      //Delete the second App
      secondaryApp.delete();
      
      if(this.success == true || this.success == undefined) {
        //successfull registered
        this.adduserform.get('firstname').setValue('')
        this.adduserform.get('lastname').setValue('')
        this.adduserform.get('username').setValue('')
        this.adduserform.get('password').setValue('')
        this.formSubmitted = false;
        this.success = true;
      }
       
    }
  }
  username = ''
  password = ''
  public generateUsernameAndPasswort() {
    if((this.adduserform.get('firstname').value.length >= 3) && (this.adduserform.get('lastname').value.length >= 3)) {
      this.username = this.adduserform.get('firstname').value.substring(0,3).toLowerCase() + this.adduserform.get('lastname').value.substring(0,3).toLowerCase();
      this.password = this.username
      this.adduserform.patchValue({
        username: this.username,
        password: this.password
      })
    }
  }

  // createChallange(){
  //   var id = (<HTMLInputElement>document.getElementById("challangeName")).value;
  //   var descriptionDone = (<HTMLInputElement>document.getElementById("descriptionDone")).value;
  //   var descriptionOpen = (<HTMLInputElement>document.getElementById("descriptionOpen")).value;
  //   var header = (<HTMLInputElement>document.getElementById("header")).value;
  //   var imageURL = (<HTMLInputElement>document.getElementById("imageURL")).value;
  //   console.log("created: " + id)
  //   this.afs.addChallangeDocument(id, descriptionDone, descriptionOpen, header, imageURL)
  // }
}