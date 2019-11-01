import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService]
})
export class PostDetailComponent implements OnInit {
  public post: Post;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getPost();
  }

  getPost(){
    // SACAR ID DEL POST
    this._route.params.subscribe(params=>{
      let id = +params['id'];
      this._postService.getPost(id).subscribe(
        response=>{
          if(response.status == 'success'){
            this.post = response.post;
            console.log(this.post);
          } else{
            this._router.navigate(['home']);
          }
        },
        error=>{
          this._router.navigate(['home']);
        }
      );
    });
    // PETICION AJAX DEL SERVICIO
  }

}
