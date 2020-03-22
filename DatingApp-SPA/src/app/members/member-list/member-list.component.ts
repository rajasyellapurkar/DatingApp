import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/pagination';
import { PageChangedEvent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  pageNumber: number;
  users: User[];
  user:User = JSON.parse(localStorage.getItem('user'));
  userParams: any = {};
  pagination : Pagination;
  
  constructor(private userService:UserService, private alertify:AlertifyService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data =>{
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.initializeUserParams();
  }

  initializeUserParams()
  {
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;   
    this.userParams.orderBy = 'lastActive';
  }

  pageChanged(event: PageChangedEvent)
  {
    this.pageNumber = event.page;    
    this.loadUsers();
  }

  loadUsers()
  {
    this.userService.getUsers(this.pageNumber,this.pagination.itemsPerPage,this.userParams)
        .subscribe(res => {
          this.users=res.result;
        },
        err =>
        {
          this.alertify.error("Error occured" + err);
        })
  }

  resetFilter(){
    this.initializeUserParams();    
    this.loadUsers();
  }

}
