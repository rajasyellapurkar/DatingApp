import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class JwtService {

jwtHelper = new JwtHelperService();

constructor() { }

decodeToken(token:any){
  return this.jwtHelper.decodeToken(token);
}

isTokenExpired(token:any){
  return this.jwtHelper.isTokenExpired(token);
}

}
