import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { interval, timer } from 'rxjs'
@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.css']
})
export class RouletteComponent implements OnInit, OnDestroy {
  private userEndpoint:string = '/api/users' // http://localhost:8081
  private rouletteEndpoint: string = '/api/roulette';

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

  showResult: boolean = false;

  rouletteColor: string = '';

  alertMessage: string = '';
  showAlert: boolean = false;

  constructor(
    private service: DataService
  ) { }

  async ngOnInit(){
    // this.cont.subscribe( (n: any) => {
    //   this.start -= n;

    //   this.contador = `${this.start % this.minutos}`

    // })

    // obtenemos la fecha de hoy
    this.getDate();

    // obytenemos el clima
    await this.getWeather();

    // checkiamos si hay usuarios para apostar
    await this.getUsers();

    if( this.users.length === 0 ){
      this.emptyUsers = true;
      this.paused = true;
    };
  }

  ngOnDestroy(){
    clearInterval( this.ejecution );
  };

  closeAlert(){
    this.showAlert = false;
  }

  getDate(){
    let hoy = `${this.day.getDate()}/${(this.day.getMonth()+1)}/${this.day.getFullYear()}`
    let mañana = `${this.day.getDate() + 1}/${(this.day.getMonth()+1)}/${this.day.getFullYear()}`
    //let hora = this.day.getHours() + ":" + this.day.getMinutes() + ":" + this.day.getSeconds();

    this.dates = {
      today: `${hoy}`,
      tomorrow: `${mañana}`
    }
  };

  async getWeather(){
    await this.service.getWeather()
      .then( (res: any) => {
        let forecast = res.daily;

        this.weatherForecast = [ forecast[0].temp.day, forecast[1].temp.day ];
      } )
      .catch( (error) => {
        console.log(error);
      } )
  };

  async setTable(){
    // reiniciamos el resultado de la ruleta
    this.showResult = false;

    // obtenemos la fecha de hoy
    this.getDate();

    // obytenemos el clima
    await this.getWeather();

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
    await this.service.getData( this.userEndpoint )
      .then( (res: any) => {
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
    this.paused = true;

    this.calBet();

    // chekiamos cada 3 minutos he iniciamos la ronda
    this.ejecution = setInterval( async() => await this.setTable(), 180000); // 180000

  };

  userBet(){
    // ---
    this.users.forEach( (usr: any) =>{
      // si el saldo es 1000 o menos apostamos todo
      if( usr.saldo <= 1000 ) {
        usr.apuesta = usr.saldo;
      }
      else if( usr.saldo > 1000 ){
        // si ambos días son mayores a 20° la apuesta es entre un
        // 3% y 7%
        if( this.weatherForecast[0] > 20 && this.weatherForecast[1] > 20 ){
          // generamos el procentage entre 3 y 7
          // Math.floor(Math.random() * (max - min + 1)) + min;
          const perBet = Math.floor( Math.random() * 5) + 3;
          const bet = Math.round( (usr.saldo * perBet)/100 );

          usr.apuesta = bet;
        }else{
          // si no la apuesta es entre un

          // generamos el porcentaje entre 8 y 15
          const perBet = Math.floor( Math.random() * 8 ) + 8;

          const bet = Math.round( (usr.saldo * perBet)/100 );
          usr.apuesta = bet;
        };
      }else usr.apuesta = 0;

      // luego de tener el monto a apostar, decidimos el color de cada jugador
      const userColor = this.getBetColor();
      usr.color = userColor;
    } );


    // mostramos la apuesta de los jugadores
    this.showBet = true;
  };

  async calBet(){
    // calulo la apuesta de los usuarios
    this.userBet();

    // Hacemos correr la ruleta
    this.rouletteColor = this.getBetColor();
    // mostramos la apuesta de la ruleta
    this.showResult = true;
    // calculo los saldos
    this.calTotal();

    await this.updateTotal();
  };

  async calTotal(){
    let pago = {
      verde: 15,
      rojo: 2,
      negro: 2
    };

    this.users.forEach( ( usr: any ) => {
      if( this.rouletteColor === 'verde' ){
        // gana lo apostado segun el pago del color
        if( usr.color === this.rouletteColor) usr.saldo = usr.saldo + ( usr.apuesta * pago.verde );
        else usr.saldo = usr.saldo - usr.apuesta;
      };

      if( this.rouletteColor === 'rojo' ){
        // gana lo apostado segun el pago del color
        if( usr.color === this.rouletteColor) usr.saldo = usr.saldo + ( usr.apuesta * pago.rojo );
        else usr.saldo = usr.saldo - usr.apuesta;
      };

      if( this.rouletteColor === 'negro' ){
        // gana lo apostado segun el pago del color
        if( usr.color === this.rouletteColor) usr.saldo = usr.saldo + ( usr.apuesta * pago.negro );
        else usr.saldo = usr.saldo - usr.apuesta;
      };
    } );

  };

  async updateTotal(){

    let bodyUsers: any[] = []
    this.users.forEach( (usr: any) => {
      //id, saldo, apuesta
      bodyUsers.push( { nombre: usr.nombre , saldo: usr.saldo, apuesta: usr.apuesta } );
    } );

    let body = {
      apostadores: bodyUsers,
      resultado: this.rouletteColor,
      fecha: this.dates.today
    };

    this.service.postData( this.rouletteEndpoint, body )
      .then( (res: any) => {
        if( res.status === 200 ){
          this.alertMessage = res.message;

          this.showAlert = true;
        }
      } )
      .catch( (err: any) => {
        console.log( err );
        this.alertMessage = 'No pudimos actualizar la partida, intente nuevamente.';

        this.showAlert = true;
        window.location.reload();
      } )
  };

  getBetColor(){
    let color: string = '';
    let colors: string[] = [ 'verde', 'rojo' , 'negro'];
    let percentage: number[] = [ 2, 49, 49 ];

    // tomamos un numero entre 1 y 100
    var num = Math.floor( ( Math.random()*100 ) +1 );

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
