import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {


  public page_title: string;
  public user: User;
  public status: string;
  public token: string;
  public identity;


  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = "Identifícate";
    this.user = new User(1, "", "", "", "", "ROLE_USER", "", "");

    // if(localStorage.getItem('identity')){
    //   this._router.navigate(['home']);
    // }
  }

  ngOnInit() {
    // SE EJECUTA SIEMPRE QUE SE ABRE EL COMPONENTE, PERO SOLO SE CIERRA SESION SI LE LLEGA EL PARAMETRO SURE
    this.logout();
  }

  onSubmit(form) {
    this._userService.signup(this.user).subscribe(
      response => {
        // DEVUELVE EL TOKEN
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;

          // DEVUELVE EL OBJETO IDENTIFICADO

          this._userService.signup(this.user, true).subscribe(
            response => {
              this.identity = response;

              // PERSISTIR DATOS DEL USUARIO IDENTIFICADO
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));

              // REDIRECCION A HOME

              this._router.navigate(['home']);
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          );

        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );

  }

  logout() {
    this._route.params.subscribe(params => {
      let logout = +params['sure'];
      if (logout == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        // REDIRECCION A HOME

        this._router.navigate(['home']);
      }

    });
  }

}
