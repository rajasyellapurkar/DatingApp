import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService 
{

baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

getUsers() : Observable<User[]>
{
  return this.http.get<User[]>(this.baseUrl + 'user');
}

getUser(id: number) : Observable<User>{
  return this.http.get<User>(this.baseUrl + 'user/' + id);
}

}
