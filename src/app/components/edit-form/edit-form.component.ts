import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  private auxEndpoint:string = '/api/users' //http://localhost:8081
  user: any;
  newUserForm: any = {};
  showAlert: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: DataService,
    private form: FormBuilder,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.user = params;
    });

    // definimos el formulario
    this.newUserForm = this.form.group({
      name: [ `${this.user['nombre']}` , [ Validators.required, Validators.minLength(6) ] ],
      email: [ `${this.user['correo']}`,  [ Validators.required, Validators.email ] ]
    });

  }

  // setiamos un getter para controlar los errores de validacion
  get f(): { [key: string]: AbstractControl } {
    return this.newUserForm.controls;
  }

  async edit(){
    if (this.newUserForm.invalid) {
      return;
    };

    const { name, email } = this.newUserForm.value;

    let body = {
      nombre: name,
      correo: email
    };

    await this.service.putData( `${this.auxEndpoint}/${this.user._id}`, body )
      .then( (res: any) => {
        if( res.status === 200 ){
          this.location.back();
          this.showAlert = false;
        }
        else this.showAlert = true
      })
      .catch( (error: any) => {
        console.error( error );
        this.showAlert = true
      } )
  }

  cancel(){
    this.location.back();
  }

  closeAlert(){
    this.showAlert = false;
  }
}
