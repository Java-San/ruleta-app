import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  private history: any[] = [];

  constructor(
    private dataServcice: DataService
  ) { }

  ngOnInit(): void {
    console.log( 'ng init' )
    this.getHistory();
  }

  getHistory(){
    console.log( 'get history' )
    this.dataServcice.getData().subscribe(  );
  }
}
