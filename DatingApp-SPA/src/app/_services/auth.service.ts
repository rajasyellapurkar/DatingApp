import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = 'http://localhost:5000/api/auth/';

decodeToken;

constructor(private http: HttpClient, private jwtService:JwtService) { }

login(model:any){
  return this.http.post(this.baseUrl + 'login',model)
         .pipe(
           map((response:any)=>{
             const user =response;
             if(user){
               localStorage.setItem('token',user.token);
               this.decodeToken = this.jwtService.decodeToken(user.token);
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

}
