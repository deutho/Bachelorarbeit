import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Teacher } from 'src/app/models/users.model';
import { AlertService } from 'src/app/services/alertService';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-create-reward',
  templateUrl: './create-reward.component.html',
  styleUrls: ['./create-reward.component.css']
})
export class CreateRewardComponent implements OnInit {
  
  formSubmitted = false;
  addRewardForm: FormGroup;
  currentUser: Teacher;
  imageURL;
  editingPicture=false;
  uid = uuidv4();

  constructor(private router: Router, private fb: FormBuilder, private afs: FirestoreDataService, private alert: AlertService) { }

  ngOnInit(): void {
    this.afs.currentUserStatus.subscribe(data => this.currentUser = data as Teacher);
    this.addRewardForm = this.fb.group({
      object:  ['', Validators.required],
      imageURL: ['', Validators.required],
      price: ['', Validators.required],
    })
  }

  addReward(){
    this.formSubmitted = true;

    if(this.addRewardForm.valid){
      let object :string = this.addRewardForm.get('object').value
      let imageURL :string = this.addRewardForm.get('imageURL').value
      let price :string = this.addRewardForm.get('price').value
      let payload = {"object": object,"imageURL": imageURL, "price": price};
      this.currentUser.individualtargets[this.uid]= payload
      this.afs.UpdateIndividualTargets(this.currentUser.individualtargets, this.currentUser.uid).then(()=>{
        this.router.navigate(['shop'])
      }).catch(()=>{
        this.alert.error("Belohnung konnte aufgrund von Netzwerkproblemen nicht erstellt werden.")
      })
    }




    // this.router.navigate(['shop'])
  }

  pictureEdited(imageURL?: string) {  
    if((<HTMLInputElement>document.getElementById('URL')) == null) return;
    if(imageURL != null) this.imageURL = imageURL
    else this.imageURL = (<HTMLInputElement>document.getElementById('URL')).value;
    console.log(this.imageURL)
    this.editingPicture = false;            
  }

  abortPictureEdit() {
    //Delete the Uploaded Picture in case the Process was aborted    
    this.editingPicture = false;
  }

}
