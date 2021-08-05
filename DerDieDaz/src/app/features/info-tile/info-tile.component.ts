import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'info-tile',
  templateUrl: './info-tile.component.html',
  styleUrls: ['./info-tile.component.css']
})
export class InfoTileComponent implements OnInit {
  @Input() public header: string;
  @Input() public image: string;
  @Input() public descriptionFront: string;
  @Input() public descriptionBack: string;
  @Input() public buttonText: string;
  @Input() public buttonAction: string;
  loaded = false
  height = 0;

  constructor() {
    
   }

  ngOnInit(): void {
    this.loaded = false
  }

  // calc height of cards by Typescript because CSS can't do it...
  callSizeUpdate(){
    if (this.loaded == false){
     
      this.addHeight(document.getElementById(this.header + this.image + 'lable'))     
      this.loaded = true
      if(this.image == undefined) this.height -= 190;
      document.getElementById(this.header + this.image + 'lable').style.height = this.height + 100 + "px"
      this.makeAllCardsSameHeight()
    }    
  }

  addHeight(element){
    if(element.className == "flip-card-back") return
    this.height += element.getBoundingClientRect().height
    var children = element.children 
    for(var i = 0; i < children.length; i++){
      this.addHeight(children[i])
    }    
  }

  // makes all cards the same height
  makeAllCardsSameHeight(){
    var maxHeight = 0;
    var allCards = document.getElementsByClassName("card-height")
    for(var i = 0; i<allCards.length; i++){
      if (maxHeight < allCards[i].getBoundingClientRect().height){
        maxHeight = allCards[i].getBoundingClientRect().height
      }
    }

    for(var j = 0; j<allCards.length; j++){
      if(document.getElementById(allCards[j].id) != undefined) document.getElementById(allCards[j].id).style.height = maxHeight + "px"
    }
  }
  
  buttonClick(buttonAction){
    if(buttonAction =="print") {
      console.log("click")
      console.log(this.header)
      
    }
  }

}
