import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { PostService } from 'src/app/services/post.service';
import { global } from '../../services/global';

import { Post } from '../../models/post';


@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  styleUrls: ['./post-edit.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {

  public page_title: string;
  public identity;
  public token;
  public post: Post;
  public status;
  public categories;
  public url: string;
  public is_edit: boolean;
  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
  };
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI: {
      url: global.url + 'post/upload',
      headers: {
        "Authorization": this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: true,
    replaceTexts: {
      resetBtn: 'Reiniciar',
      uploadBtn: 'Subir',
      attachPinBtn: 'Sube la imagen...',
      afterUploadMsg_success: '¡Subida con éxito!',
      afterUploadMsg_error: '!Subida fallida!'
    }
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = 'Editar entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.is_edit = true;
    this.url = global.url;
  }

  ngOnInit() {
    this.getCategories();
    this.post = new Post(1, this.identity.sub, 1, "", "", null, null);
    this.getPost();


  }

  getPost() {
    // SACAR ID DEL POST
    this._route.params.subscribe(params => {
      let id = +params['id'];
      // PETICION AJAX DEL SERVICIO
      this._postService.getPost(id).subscribe(
        response => {
          if (response.status == 'success') {
            this.post = response.post;
            if(this.post.user_id != this.identity.sub){
              this._router.navigate(['home']);
            }
          } else {
            this._router.navigate(['home']);
          }
        },
        error => {
          this._router.navigate(['home']);
        }
      );
    });
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(
      response => {
        if (response.status == 'success') {
          this.categories = response.categories;
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
        this.status = 'error';
      }
    );
  }

  imageUpload(data) {
    let image_data = JSON.parse(data.response);
    this.post.image = image_data.image;
  }

  onSubmit(form) {
    this._postService.update(this.token, this.post, this.post.id).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = 'success',

          this._router.navigate(['/post', this.post.id]);
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

}
