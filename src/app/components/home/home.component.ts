import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { global } from '../../services/global';

import { Post } from '../../models/post';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[PostService, UserService]
})
export class HomeComponent implements OnInit {

  public page_title: string;
  public url: string;
  public posts : Array<Post>
  public identity;
  public token;


  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.page_title = "Inicio";
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
   }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(){
    this._postService.getPosts().subscribe(
      response=>{
        if(response.status == 'success'){
          this.posts = response.posts;
        }
      },
      error=>{
        console.log(<any>error);
      }
    );
  }
  deletePost(id){
    this._postService.delete(this.token, id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.getPosts();
        }
      },
      error=>{
        console.log(<any>error);
      }
    );

  }

}
