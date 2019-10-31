import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from 'src/app/services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css'],
  providers: [UserService, CategoryService]
})
export class CategoryNewComponent implements OnInit {
  public page_title: string;
  public identity;
  public token;
  public category;
  public status: string;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService
  ) {
    this.page_title = 'Crear nueva categoría';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.category = new Category(1,"");
   }

  ngOnInit() {
  }


  onSubmit(form){
    this._categoryService.create(this.token, this.category).subscribe(
      response=>{
        if(response.status == 'success'){
          this.status = 'success'
          this.category = response.category;
          form.reset();
        } else{
          this.status = 'error';
        }
      },
      error=>{
        this.status = 'error';
        console.log(<any>error);
      }
      );
  }

  

}
