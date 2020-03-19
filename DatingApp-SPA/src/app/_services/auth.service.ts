import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = environment.apiUrl + 'auth/';
decodeToken;
currentUser: User;
private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient, private jwtService:JwtService) { }

login(model:any){
  return this.http.post(this.baseUrl + 'login',model)
         .pipe(
           map((response:any)=>{
             const user =response;
             if(user){
               localStorage.setItem('token',user.token);
               localStorage.setItem('user',JSON.stringify(user.user));
               this.currentUser = user.user;
               this.decodeToken = this.jwtService.decodeToken(user.token);
               this.changeMemberPhotoUrl(this.currentUser.photoUrl);
             }
           })
         );
}

register(model:any){
  return this.http.post(this.baseUrl + 'register',model);
}

loggedIn(){
  const token = localStorage.getItem('token');
  return !this.jwtService.isTokenExpired(token);
}

changeMemberPhotoUrl(url: string)
{
  this.photoUrl.next(url);
}

}
