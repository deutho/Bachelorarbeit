import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Teacher } from 'src/app/models/users.model';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-create-reward',
  templateUrl: './create-reward.component.html',
  styleUrls: ['./create-reward.component.css']
})
export class CreateRewardComponent implements OnInit {
  
  formSubmitted = false;
  addRewardForm: FormGroup;
  currentUser: Teacher;

  constructor(private router: Router, private fb: FormBuilder, private afs: FirestoreDataService) { }

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
    }
    console.log(this.currentUser)
    



    // this.router.navigate(['shop'])
  }

}
