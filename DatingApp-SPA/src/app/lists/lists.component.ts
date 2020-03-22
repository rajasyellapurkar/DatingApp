import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_models/pagination';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { PaginatedResult } from '../_models/paginated-result';
import { PageChangedEvent } from 'ngx-bootstrap';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  users:User[];
  pagination: Pagination;
  likesParam:string

  constructor(private authService:AuthService, private userService: UserService
    ,private activateRoute:ActivatedRoute, private alertify:AlertifyService) { }

  ngOnInit() {
    this.activateRoute.data.subscribe(data =>
      {
        this.users = data['users'].result;
        this.pagination = data['users'].pagination;
        this.likesParam = 'Likers';
      },
      error =>
      {
        this.alertify.error(error);
      });
  }

  loadUsers()
  {
    this.userService.getUsers(this.pagination.currentPage,this.pagination.itemsPerPage,null,this.likesParam)
        .subscribe((res : PaginatedResult<User[]>) => {
          this.users=res.result;
          this.pagination = res.pagination;
        },
        err =>
        {
          this.alertify.error("Error occured" + err);
        })
  }

  pageChanged(event: PageChangedEvent)
  {
    this.pagination.currentPage = event.page;    
    this.loadUsers();
  }

}
