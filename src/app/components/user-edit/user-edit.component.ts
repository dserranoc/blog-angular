import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public page_title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public url;
  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat',],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:global.url+'user/upload',
      headers: {
     "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: true,
    replaceTexts: {
      resetBtn: 'Reiniciar',
      uploadBtn: 'Subir',
      attachPinBtn: 'Sube tu avatar...',
      afterUploadMsg_success: '¡Subida con éxito!',
      afterUploadMsg_error: '!Subida fallida!'
    }
};
  constructor(
    private _userService: UserService
  ) {
    this.url = global.url;
    this.page_title = 'Ajustes';
    this.user = new User(1, "", "", "", "", "ROLE_USER", "", "");
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.user = new User(this.identity.sub, this.identity.name, this.identity.surname, this.identity.email, "", this.identity.role, this.identity.description, this.identity.image);


  }

  ngOnInit() {
  }

  onSubmit(form) {
    this._userService.update(this.token, this.user).subscribe(
      response => {
        if (response && response.status) {
          this.status = 'success';
          if (response.changes.name) {
            this.user.name = response.changes.name;
          }
          if (response.changes.surname) {
            this.user.surname = response.changes.surname;
          }
          if (response.changes.email) {
            this.user.email = response.changes.email;
          }
          if (response.changes.description) {
            this.user.description = response.changes.description;
          }
          if (response.changes.image) {
            this.user.image = response.changes.image;
          }

          this.identity = this.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));

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


  imageUpload(datos){
    let data = JSON.parse(datos.response);
    this.user.image = data.image;
  }

}
