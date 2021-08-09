import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-classgoal',
  templateUrl: './classgoal.component.html',
  styleUrls: ['./classgoal.component.css']
})
export class ClassgoalComponent implements OnInit {

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.myHeader("Klassenziel")
    
  }

}
