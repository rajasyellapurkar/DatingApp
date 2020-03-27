import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Message } from '../_models/message';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private userService:UserService,
                private alertify:AlertifyService,
                private router: Router,
                private authService:AuthService){}

    resolve(route:ActivatedRouteSnapshot): Observable<Message[]>
    {
      return this.userService.getMessages(this.authService.decodeToken.nameid,  
        this.pageNumber,this.pageSize,this.messageContainer)
      .pipe(catchError(error=> 
                    {
                        this.alertify.error('Error retrieving messages');
                        this.router.navigate(['/home']);
                        return of(null);
                    })
            );
    }
}