import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/message';
import { PageChangedEvent } from 'ngx-bootstrap';
import { AuthService } from '../_services/auth.service';
import { Pagination } from '../_models/pagination';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages:Message[];
  pagination:Pagination;
  messageContainer = 'Unread';

  constructor(private userService:UserService, 
    private alertify:AlertifyService, 
    private authService:AuthService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data =>{
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });

  }

  pageChanged(event: PageChangedEvent)
  {
    this.pagination.currentPage = event.page;    
    this.loadMessages();
  }

  loadMessages()
  {
    this.userService.getMessages(this.authService.decodeToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
        .subscribe(res => {
          this.messages=res.result;
          this.pagination = res.pagination;
        },
        err =>
        {
          this.alertify.error("Messages: Error occured" + err);
        })
  }

  deleteMessage(messageId: number)
  {
    this.alertify.confirm('Are you sure you want to delete the message?', () => {
    this.userService.deleteMessage(this.authService.decodeToken.nameid, messageId).subscribe(
      ()=>{
        this.messages.splice(this.messages.findIndex(m=>m.id === messageId),1);
        this.alertify.success('Message deleted successfully');
      },
      error => {
        this.alertify.error(error);
      }
    )});
  }


}
