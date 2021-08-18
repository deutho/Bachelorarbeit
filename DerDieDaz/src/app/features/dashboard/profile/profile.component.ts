import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { User } from 'src/app/models/users.model';
import { AlertService } from 'src/app/services/alertService';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import { flattenDiagnosticMessageText } from 'typescript';
import {MainComponent} from '../main/main.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  

  currentUser: any;
  accountTyp: String;
  imageURL = "";
  editingPicture: boolean = false;
  loaded: boolean = false;
  editingLoginReward: boolean = false;
  editingHomeworkPrice: boolean = false;
  ImageSubscription;
  UserSubscription;
  
  constructor(public afs: FirestoreDataService, private app: AppService, public router: Router, private alert: AlertService) {
    this.ImageSubscription = this.app.myImageURL$.subscribe((data) => {
      this.imageURL = data;
      this.pictureEdited(data)
    });
  }


  ngOnDestroy(): void {
   this.ImageSubscription.unsubscribe();
   this.UserSubscription.unsubscribe();
  }
  
  async ngOnInit() {
    this.UserSubscription = this.afs.currentUserStatus.subscribe(data => {
      this.currentUser = data
      if (data != null) this.initialize()
    });
  }
  
  initialize() {
    this.currentUser.username = this.currentUser.username.substring(0, this.currentUser.username.lastIndexOf('@'));

    if(this.currentUser.role == 1) this.accountTyp = "Adminaccount";
    else if(this.currentUser.role == 2) this.accountTyp = "Lehreraccount";
    else if (this.currentUser.role == 3) this.accountTyp = "Schüler";
    this.imageURL = this.currentUser.avatarID;

    this.app.myHeader("Profil");
  
    this.loaded = true;
  }

  pictureEdited(imageURL?: string) {  
    if((<HTMLInputElement>document.getElementById('URL')) == null) return;
    if(imageURL != null) this.imageURL = imageURL
    else this.imageURL = (<HTMLInputElement>document.getElementById('URL')).value;
    this.afs.updateUserPicture(this.imageURL, this.currentUser.uid)
    console.log(this.imageURL)
    this.editingPicture = false;            
  }

  abortPictureEdit() {
    //Delete the Uploaded Picture in case the Process was aborted
    if ((<HTMLInputElement>document.getElementById('URL')).value.search("firebasestorage.googleapis.com") != -1) {
      this.afs.deleteFromStorageByUrl((<HTMLInputElement>document.getElementById('URL')).value).catch((err) => {
        console.log(err.errorMessage);
        //Give Warning that Delete Operation was not successful
      });
    }
    this.editingPicture = false;
    this.imageURL = this.currentUser.avatarID;
  }

  editingLoginRewardSubmit(){
    if(parseInt((<HTMLInputElement>document.getElementById("newDailyLoginReward")).value) < 0){
      this.alert.error("Tägliche Belohnung muss positiv sein")
    }
    else{
      this.afs.updateDailyLoginReward(parseInt((<HTMLInputElement>document.getElementById("newDailyLoginReward")).value), this.currentUser.uid).then(()=>{
        this.alert.success("Belohnung der Schüler für tägliches Spielen aktualisiert.")
      }).catch(()=>{
        this.alert.error("Belohnung konnte nicht aktualisiert werden.")
      })
      this.editingLoginReward = false;
    }
  }

  editingHomeworkPriceSubmit(){
    if(parseInt((<HTMLInputElement>document.getElementById("newHomeworkPrice")).value) < 0){
      this.alert.error("Preis für tägliche Belohnung muss positiv sein")
    }
    else{
      this.afs.updateHomeworkVoucherPrice(parseInt((<HTMLInputElement>document.getElementById("newHomeworkPrice")).value), this.currentUser.uid).then(()=>{
        this.alert.success("Preis des Hausübungsgutscheines wurde aktualisiert.")
      }).catch(()=>{
        this.alert.error("Preis des Hausübungsgutscheines konnte nicht aktualisiert werden.")
      })
      this.editingHomeworkPrice = false;
    }
  }




}


