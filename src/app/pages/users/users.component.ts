import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private auxEndpoint:string = '/api/users'; //http://localhost:8081
  users: any[] = [];
  newUserForm: any = {};

  emptyUsers: boolean = true;

  alertMessage: string = '';
  showAlert: boolean = false;

  constructor(
    private service: DataService,
    private form: FormBuilder,
    private router: Router
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
        if( res.status === 200 ){
          this.users = res.data;

          if( this.users.length === 0 ) this.emptyUsers = true;
          else this.emptyUsers = false;
        }
      })
      .catch( (error: any) => {
        console.error( error );
        this.showAlert = true;
        this.alertMessage = 'No se pudo obtener los usuarios, intente nuevamente'
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
        if( res.status === 200 ){
          await this.getUsers();

          this.showAlert = false;
          this.alertMessage = '';
        }
      })
      .catch( (error: any) => {
        console.error( error );
        this.showAlert = true;
        this.alertMessage = 'No se pudo crear el usuario, intente nuevamente'
      } )

    this.newUserForm.reset();
  };

  async goToEdit( user: any){
    this.router.navigate(['/edit', user ])
  };

  async deleteUser( id: any ){
    await this.service.deleteData( `${this.auxEndpoint}/${id}` )
      .then( (res: any) => {
        if( res.status === 200 ) this.getUsers();
      })
      .catch( (error: any) => {
        console.error( error );
        this.showAlert = true;
        this.alertMessage = 'No se pudo eliminar el usuario, intente nuevamente'
      } )
  };

  closeAlert(){
    this.showAlert = false;
  }
}
