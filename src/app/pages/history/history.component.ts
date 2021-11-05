import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  rounds: any[] = [];
  private rouletteEndpoint: string = '/api/roulette'; //http://localhost:8081

  emptyRounds: boolean = false;
  showAlert: boolean = false;


  constructor(
    private dataServcice: DataService
  ) { }

  ngOnInit(): void {
    this.getHistory();
  }

  async getHistory(){
    await this.dataServcice.getData( this.rouletteEndpoint )
      .then( ( res: any ) => {
        if( res.status === 200 ){
          if( res.data.length !== 0 ){
            this.rounds = res.data;
            this.emptyRounds = false;
            this.showAlert = false;
          }else{
            this.emptyRounds = true;
            this.showAlert = false;
          }
        }
      } )
      .catch( (error: any) => {
        console.error( error );
        this.emptyRounds = true;
        this.showAlert = true;
      } );
  }
}
