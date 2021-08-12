import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from 'src/app/alert/alert.component';
import { Student, Teacher, User } from 'src/app/models/users.model';
import { AlertService } from 'src/app/services/alertService';
import { AppService } from 'src/app/services/app.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-classgoal',
  templateUrl: './classgoal.component.html',
  styleUrls: ['./classgoal.component.css']
})
export class ClassgoalComponent implements OnInit, OnDestroy {

  currentUserSubscription;
  currentUser: User;
  teacher: Teacher;
  goalText: string;
  goalPrice: number;
  numbers;
  updateClassGoalForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(private app: AppService, private afs: FirestoreDataService, private fb: FormBuilder, private alert: AlertService) { }


  async ngOnInit() {
    this.app.myHeader("Klassenziel")
    this.currentUserSubscription = this.afs.currentUserStatus.subscribe(data => {
      this.currentUser = data
      if(data != null){
        this.initialize()
      }
    })   
    this.updateClassGoalForm = this.fb.group({
      goalDesc: ['', Validators.required],
      goalPrice: ['', Validators.required],
      progressPrice: ['', Validators.required]
    })

  
  }

  async initialize(){
    this.numbers = Array(100).fill(1).map((x,i)=>i);
    if(this.currentUser.role == 3) this.teacher = (await this.afs.getUserPerID(this.currentUser.parent))[0]
    if(this.currentUser.role == 2) this.teacher = this.currentUser as Teacher
    console.log(this.teacher)
    var tempKeys: string[] = [];
    var tempValues: number[] = [];
    

    for (const [key, value] of Object.entries(this.teacher.classtargets)) { 
      tempKeys.push(key)
      tempValues.push(value)
    }

    if( tempKeys.length == 1 && tempValues.length == 1){
      this.goalText = tempKeys[0];
      this.goalPrice = tempValues[0];
      if(this.teacher.classtargetBalance > 0){
        console.log( this.teacher.classtargetBalance / this.goalPrice + "%")
        document.getElementById("progress-bar").style.height = (this.teacher.classtargetBalance / this.goalPrice)*100 + "%"
        document.getElementById("progress-text").style.bottom = (this.teacher.classtargetBalance / this.goalPrice)*100-5 + "%"
      }
      else{
        document.getElementById("progress-bar").style.height = "0%"
        document.getElementById("progress-text").style.bottom = "0%"
      }      
      setTimeout(() => this.startConfettiColoring(), 1000)
    }  
  }

  startConfettiColoring(){
    var confettis = document.getElementsByClassName("confetti")
    console.log(confettis)
    
    var j = 0;
    var letters = '0123456789ABCDEF';
    
    for(let confetti in confettis){
      var color = '#';
      for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      if(document.getElementById("confetti-"+j) != undefined){
        document.getElementById("confetti-"+j).style.backgroundColor = color
        document.getElementById("confetti-"+j).style.left = this.getRandomArbitrary(0,100) + "%" 
        document.getElementById("confetti-"+j).style.animationDelay = this.getRandomArbitrary(0,5) +"s"
      }
      j++;
    }
  }


  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  onSubmit(){
    this.formSubmitted = true;
    let inputGoalDesc = this.updateClassGoalForm.get('goalDesc').value
    let inputGoalPrice = this.updateClassGoalForm.get('goalPrice').value
    let inputProgressPrice = this.updateClassGoalForm.get('progressPrice').value
    if(inputGoalDesc != this.goalText || inputGoalPrice != this.goalPrice || inputProgressPrice != this.teacher.classtargetBalance){
      // update classgoal
      this.afs.updateClassTarget(inputGoalDesc, inputGoalPrice, inputProgressPrice, this.teacher.uid).then(() => {
        this.alert.success("Klassenziel wurde aktualisiert.")
      }).catch(()=>{
        this.alert.error("Klassenziel konnte nicht aktualisiert werden.")
      })
    }
    else{
      this.alert.success("Keine Änderungen.")
    }
    document.getElementById("abortButton").click()
  }

  setInputFieldValues(){
    this.updateClassGoalForm.get('goalDesc').setValue(this.goalText)
    this.updateClassGoalForm.get('goalPrice').setValue(this.goalPrice)
    this.updateClassGoalForm.get('progressPrice').setValue(this.teacher.classtargetBalance)
  }

  // openModal(){
  //   if(this.currentUser.role == 2){
  //     document.getElementById("openModalButton").click()
  //   }
  // }

}
