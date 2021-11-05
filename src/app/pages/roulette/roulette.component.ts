import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { interval, timer } from 'rxjs'
@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.css']
})
export class RouletteComponent implements OnInit, OnDestroy {
  private auxEndpoint:string = 'http://localhost:8081/api/users'
  users: any[] = [];
  weatherForecast: number[] = [];
  paused: boolean = false;
  emptyUsers: boolean = true;

  day = new Date();
  dates = {
    today: '',
    tomorrow: ''
  };

  showBet: boolean = false;

  ejecution: any = null;

  badgeColor: string = '';

  senderBody = {
    resultado: '',
    fecha: this.dates.today,
    apostadores: []
  };

  private start: any = 180000;
  contador: string = '';
  private minutos = 60;

  cont = interval( 1000 );
  constructor(
    private service: DataService
  ) { }

  async ngOnInit(){
    this.cont.subscribe( (n: any) => {
      this.start -= n;

      this.contador = `${this.start % this.minutos}`

    })
    let hoy = `${this.day.getDate()}/${(this.day.getMonth()+1)}/${this.day.getFullYear()}`
    let mañana = `${this.day.getDate() + 1}/${(this.day.getMonth()+1)}/${this.day.getFullYear()}`
    let hora = this.day.getHours() + ":" + this.day.getMinutes() + ":" + this.day.getSeconds();

    this.dates = {
      today: `${hoy} ${ hora }`,
      tomorrow: `${mañana} ${ hora }`
    }

    // obytenemos el clime
    await this.getWeather();

    // checkiamos si hay usuarios para apostar
    await this.getUsers();

    if( this.users.length === 0 ){
      this.emptyUsers = true;
      this.paused = true;
    };
  }

  ngOnDestroy(){
    //!clearInterval( this.ejecution );
  };

  hello(){
    console.log('hello')
  }

  async getWeather(){
    await this.service.getWeather()
      .then( (res: any) => {
        console.log( 'res weather', res );
        let forecast = res.daily;

        this.weatherForecast = [ forecast[0].temp.day, forecast[1].temp.day ];
      } )
      .catch( (error) => {
        console.log(error);
      } )
  };

  async setTable(){
    // traer los usuarios
    await this.getUsers();

    // iniciamos las rondas solo si existen usuarios que apuesten
    if( this.users.length === 0 ){
      this.emptyUsers = true;
      return
    }

    // calculamos la apuesta antes de girar la ruleta
    this.calBet();
  };

  async getUsers(){
    await this.service.getData( this.auxEndpoint )
      .then( (res: any) => {
        console.log( 'get users', res );
        if( res.status === 200 ){
          let data = res.data;

          if( data.length === 0 ) {
            this.emptyUsers = true;
          }
          else {
            data.map( (el: any) => {
              el['apuesta'] = 0;
              el['color'] = 'color'
            });

            this.users = data;
            this.emptyUsers = false;
          }
        }
      })
      .catch( (error: any) => {
        console.error( error );
        this.emptyUsers = true;
      } )
  };

  startRounds(){
    console.log( 'iniciar ronda' );

    this.paused = true;

    this.calBet();

    //! chekiamos cada 3 minutos he iniciamos la ronda
    //!this.ejecution = setInterval( async() => await this.setTable(), 5000); // 180000

  };

  async calBet(){
    console.log( 'cal bet', this.users );

    this.users.forEach( (el: any) =>{
      // si el saldo es 1000 o menos apostamos todo
      if( el.saldo <= 1000 ) {
        console.log( 'saldo con 1000 o menos' )
        el.apuesta = el.saldo;
      }
      else if( el.saldo > 1000 ){
        // si ambos días son mayores a 20° la apuesta es entre un
        // 3% y 7%
        if( this.weatherForecast[0] > 20 && this.weatherForecast[1] > 20 ){
          console.log('ambas temperaturas mayores a 20')

          // generamos el procentage entre 3 y 7
          // Math.floor(Math.random() * (max - min + 1)) + min;
          const perBet = Math.floor( Math.random() * 5) + 3;
          console.log( 'porcent apostado', perBet );

          const bet = Math.round( (el.saldo * perBet)/100 );
          console.log( 'bet', bet );

          el.apuesta = bet;
        }else{
          // si no la apuesta es entre un
          console.log('alguna temperatura es menor a 20');

          // generamos el porcentaje entre 8 y 15
          const perBet = Math.floor( Math.random() * 8 ) + 8;
          console.log( 'porcent apostado', perBet );

          const bet = Math.round( (el.saldo * perBet)/100 );
          console.log( 'bet', bet );

          el.apuesta = bet;
        };
      }else el.apuesta = 0;

      //TODO luego de tener el monto a apostar, decidimos el color de cada jugador
      const color = this.getBetColor();
      console.log( 'color', color );
    } );

    console.log( 'users', this.users );

    this.showBet = true;

    // Hacemos correr la ruleta
    this.spinRoulette()

    //TODO calculamos los saldos y actualizamos a la base
    await this.updateTotal( );
  };

  // TODO
  spinRoulette(){
    // determinamos el color de la ruleta
  };

  async updateTotal(  ){
    let body = {

    };
  };

  getBetColor(){
    let color: string = '';
    let colors: string[] = [ 'verde', 'rojo' , 'negro'];
    let percentage: number[] = [ 2, 49, 49 ];

    // tomamos un numero entre 1 y 100
    var num = Math.floor( ( Math.random()*100 ) +1 );
    console.log( 'n100', num );

    if( num <= percentage[0] ) {
      color = colors[0];
    } else if ( num <= 51 ) {
      color = colors[1];
    } else {
      color = colors[2];
    }
    return color;
  };
}
