import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { global } from '../../services/global';

import { Post } from '../../models/post';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService, UserService]
})
export class ProfileComponent implements OnInit {

  public url: string;
  public posts: Array<Post>;
  public user: User;
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _route: ActivatedRoute
  ) {
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this._route.params.subscribe(params => {
      let userId = +params['id'];
      this.getUser(userId);
      this.getPosts(userId);
    });
  }

  getPosts(userId) {
    this._userService.getPostsByUser(userId).subscribe(
      response => {
        if (response.status == 'success') {
          this.posts = response.posts;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  getUser(userId) {
    this._userService.getUser(userId).subscribe(
      response => {
        if (response.status == 'success') {
          this.user = response.user;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  deletePost(id) {
    this._postService.delete(this.token, id).subscribe(
      response => {
        if (response.status == 'success') {
          this.getProfile();
        }
      },
      error => {
        console.log(<any>error);
      }
    );

  }

}
