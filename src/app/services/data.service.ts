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

    //return this.http.get('/roulette/history');http://localhost:8081/
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
}
