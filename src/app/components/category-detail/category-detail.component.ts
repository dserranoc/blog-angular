import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { global } from '../../services/global';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService, UserService, PostService]
})
export class CategoryDetailComponent implements OnInit {
  public page_title: string;
  public url: string;
  public category: Category;
  public posts: any;
  public identity;
  public token;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _categoryService: CategoryService,
    private _userService: UserService,
    private _postService: PostService
  ) {
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
   }

  ngOnInit() {
    this.getPostsByCategory();
  }

  getPostsByCategory(){
    this._route.params.subscribe(params=>{
      let id = +params['id'];

      this._categoryService.getCategory(id).subscribe(
        response=>{
          if(response.status == 'success'){
            this.category = response.category;
            this._categoryService.getPostsByCategory(id).subscribe(
              response=>{
                if(response.status == 'success'){
                  this.posts = response.posts;
                } else {
                  this._router.navigate(['/home']);
                }
              },
              error=>{
                console.log(<any>error);
              }
            );
          } else{
            this._router.navigate(['/home']);
          }
        },
        error=>{
          console.log(<any>error);
        }
      );
    });
  }

  deletePost(id){
    this._postService.delete(this.token, id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.getPostsByCategory();
        }
      },
      error=>{
        console.log(<any>error);
      }
    );

  }

}
