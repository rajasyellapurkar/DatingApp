import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
  
    constructor(private userService:UserService,
                private alertify:AlertifyService,
                private router: Router,
                private authService: AuthService){}

    resolve(route:ActivatedRouteSnapshot): Observable<User>
    {
      return this.userService.getUser(this.authService.decodeToken.nameid)
      .pipe(catchError(error=> 
                    {
                        this.alertify.error('Error retrieving data for edit');
                        this.router.navigate(['/members']);
                        return of(null);
                    })
            );
    }
}