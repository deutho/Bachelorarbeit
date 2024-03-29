import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reward } from 'src/app/models/reward.model';
import { Teacher } from 'src/app/models/users.model';
import { AlertService } from 'src/app/services/alertService';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-create-reward',
  templateUrl: './create-reward.component.html',
  styleUrls: ['./create-reward.component.css']
})
export class CreateRewardComponent implements OnInit, OnDestroy {
  
  formSubmitted = false;
  addRewardForm: FormGroup;
  currentUser: Teacher;
  imageURL = "";
  editingPicture=false;
  uid = uuidv4();
  imageURLSubscription;
  userSubscription;
  sub;
  id: string;
  header: string;
  image: string;
  price: number;

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private afs: FirestoreDataService, private alert: AlertService, private app: AppService) {
    this.imageURLSubscription = this.app.myImageURL$.subscribe((data) => {
      this.imageURL = data;
      console.log(this.imageURL)
      this.pictureEdited(data)
    });
   }


  ngOnDestroy(): void {
    this.imageURLSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubscription = this.afs.currentUserStatus.subscribe(data => this.currentUser = data as Teacher);
    this.sub = this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.header = params['Description'];
      this.imageURL = params['image']
      this.price = +params['price']
      console.log(params['Description'])
      // In a real app: dispatch action to load the details here.
   });
    this.addRewardForm = this.fb.group({
      object:  [this.header, Validators.required],
      // imageURL: ['', Validators.required],
      price: [this.price, Validators.required],
    })
    
  }

  addReward(){
    this.formSubmitted = true;
    if(this.addRewardForm.valid){
      
      if(this.imageURL == "") {
        this.alert.error("Es wurde kein Bild für die Belohnung gewählt.")
        return
      }
      let object :string = this.addRewardForm.get('object').value
      let imageURL :string = this.imageURL
      let price :string = this.addRewardForm.get('price').value
      let payload = {"object": object,"imageURL": imageURL, "price": price};
      console.log("payload:"+payload)
      if(this.id == null) this.currentUser.individualtargets[this.uid]= payload
      else this.currentUser.individualtargets[this.id]= payload
      this.afs.UpdateIndividualTargets(this.currentUser.individualtargets, this.currentUser.uid).then(()=>{
        this.imageURL = ""
        this.router.navigate(['shop'])
      }).catch(()=>{
        this.alert.error("Belohnung konnte aufgrund von Netzwerkproblemen nicht erstellt werden.")
      })
    }


  // addReward(){
  //   this.formSubmitted = true;
  //   if(this.addRewardForm.valid){
      
  //     if(this.imageURL == "") {
  //       this.alert.error("Es wurde kein Bild für die Belohnung gewählt.")
  //       return
  //     }
  //     let object :string = this.addRewardForm.get('object').value
  //     let imageURL :string = this.imageURL
  //     let price :string = this.addRewardForm.get('price').value

  //     let newReward = <Reward> {
  //       uid: this.uid,
  //       imageURL: imageURL,
  //       price: parseInt(price),
  //       name: object
  //     }
      
  //     let currRewards: Reward[] = this.currentUser.individualtargets;
  //     currRewards.push(newReward);

  //     this.afs.UpdateIndividualTargets(this.currentUser.individualtargets, this.currentUser.uid).then(()=>{
  //       this.imageURL = ""
  //       this.router.navigate(['shop'])
  //     }).catch(()=>{
  //       this.alert.error("Belohnung konnte aufgrund von Netzwerkproblemen nicht erstellt werden.")
  //     })
  //   }






    // this.router.navigate(['shop'])
  }

  pictureEdited(imageURL?: string) {  
    if((<HTMLInputElement>document.getElementById('URL')) == null) return;
    if(imageURL != null) {
      this.imageURL = imageURL
      console.log(imageURL)
    }
    else this.imageURL = (<HTMLInputElement>document.getElementById('URL')).value;
    this.editingPicture = false;            
  }

  abortPictureEdit() {
    this.editingPicture = false;
  }

  deleteShopItem(){
    delete this.currentUser.individualtargets[this.id]
    this.afs.UpdateIndividualTargets(this.currentUser.individualtargets, this.currentUser.uid).then(()=>{
      this.imageURL = ""
      this.router.navigate(['shop'])
    }).catch(()=>{
      this.alert.error("Belohnung konnte aufgrund von Netzwerkproblemen nicht erstellt werden.")
    })
  }

}
