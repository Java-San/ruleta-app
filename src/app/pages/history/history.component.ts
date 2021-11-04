import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  private history: any[] = [];
  private auxEndpoint:string = 'http://localhost:8081'

  constructor(
    private dataServcice: DataService
  ) { }

  ngOnInit(): void {
    console.log( 'ng init' )
    this.getHistory();
  }

  async getHistory(){
    console.log( 'get history' )
    await this.dataServcice.getData( `${this.auxEndpoint}/roulette/history` )
      .then( ( res: any ) => {
        console.log( 'RES', res );
      } )
      .catch( (error: any) => {
        console.error( error );
      } );
  }
}
