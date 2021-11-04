import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private auxEndpoint:string = 'http://localhost:8081/api/users'
  users: any[] = [];
  newUserForm: any = {};

  emptyUsers: boolean = true;

  constructor(
    private service: DataService,
    private form: FormBuilder
  ) {

  }

  ngOnInit(): void {
    // definimos el formulario
    this.newUserForm = this.form.group({
      name: ['', [ Validators.required, Validators.minLength(6) ] ],
      email: [ '',  [ Validators.required, Validators.email ] ]
    });

    this.getUsers();
  }

  // setiamos un getter para controlar los errores de validacion
  get f(): { [key: string]: AbstractControl } {
    return this.newUserForm.controls;
  }


  async getUsers(){
    await this.service.getData( this.auxEndpoint )
      .then( (res: any) => {
        console.log( 'get users', res );
        if( res.status === 200 ){
          this.users = res.data;

          if( this.users.length === 0 ) this.emptyUsers = true;
          else this.emptyUsers = false;
        }
      })
      .catch( (error: any) => {
        console.error( error );
      } )
  };

  async createUser(){
    if (this.newUserForm.invalid) {
      return;
    };

    let body = {
      nombre: this.newUserForm.value.name,
      correo: this.newUserForm.value.email,
      saldo: 10000
    };

    await this.service.postData( this.auxEndpoint, body )
      .then( async (res: any) => {
        if( res.status === 200 ) await this.getUsers();
      })
      .catch( (error: any) => {
        console.error( error );
      } )
  };

  async editUser(){
    let body: any = null;

    console.log('edit');
    await this.service.putData( this.auxEndpoint, body )
      .then( (res: any) => {
        console.log( 'get users', res );
      })
      .catch( (error: any) => {
        console.error( error );
      } )
  };

  async deleteUser(){
    console.log( 'delete' )
    await this.service.deleteData( this.auxEndpoint )
      .then( (res: any) => {
        console.log( 'get users', res );
      })
      .catch( (error: any) => {
        console.error( error );
      } )
  };
}
