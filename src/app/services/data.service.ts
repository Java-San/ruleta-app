import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  private API_KEY = '1464823860b8aa553902bcb49dc663dd';
  private apiEndpoint = 'https://api.openweathermap.org/data/2.5/onecall'

  private weatherOps = {
    lat: -33.4569400,
    lon: -70.6482700,
    units: 'metric',
    exclude: 'current,minutely,hourly,alerts'
  };

  constructor(
    private http: HttpClient
  ) { }


  getData( endpoint: string ){
    return new Promise( ( reso, rej ) => {
      this.http.get( endpoint, { headers: this.headers } )
        .toPromise()
        .then( ( res: any ) => {
          reso(res);
        })
        .catch( (e: any) =>{
          rej(e)
        } );
    });
  };

  postData(endpoint: string, data: any){
    return new Promise( ( reso, rej ) => {
      this.http.post( endpoint, data, { headers: this.headers } )
        .toPromise()
        .then( ( res: any ) => {
          reso(res);
        })
        .catch( (e: any) =>{
          rej(e)
        } );
    });
  };

  putData( endpoint: string, data: any ){
    return new Promise( ( reso, rej ) => {
      this.http.put( endpoint, data, { headers: this.headers } )
        .toPromise()
        .then( ( res: any ) => {
          reso(res);
        })
        .catch( (e: any) =>{
          rej(e)
        } );
    });
  };

  deleteData( endpoint: string ){
    return new Promise( ( reso, rej ) => {
      this.http.delete( endpoint, { headers: this.headers } )
        .toPromise()
        .then( ( res: any ) => {
          reso(res);
        })
        .catch( (e: any) =>{
          rej(e)
        } );
    });
  };

  getWeather(){
    return new Promise( (resolve, reject) => {
      this.http.get( this.apiEndpoint + `?lat=${this.weatherOps.lat}&lon=${this.weatherOps.lon}&units=${this.weatherOps.units}&exclude=${this.weatherOps.exclude}&appid=${this.API_KEY}` )
        .toPromise()
        .then( (res: any) => {
          resolve(res)
        })
        .catch( (error: any) => {
          reject(error);
        } )
    } );
  }
}
