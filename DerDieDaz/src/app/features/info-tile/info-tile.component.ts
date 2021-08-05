import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'info-tile',
  templateUrl: './info-tile.component.html',
  styleUrls: ['./info-tile.component.css']
})
export class InfoTileComponent implements OnInit {
  @Input() public text: string;

  constructor() { }

  ngOnInit(): void {
  }

}
