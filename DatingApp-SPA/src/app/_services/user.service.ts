import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/paginated-result';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(pageNumber?, pageSize?, userParams?): Observable<PaginatedResult<User[]>> {
    let paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (pageNumber != null && pageSize != null)
    {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);      
    }

    if(userParams != null)
    {
      params = params.append('minAge',userParams.minAge);
      params = params.append('minAge',userParams.maxAge);
      params = params.append('orderBy',userParams.orderBy);
    }

    return this.http.get<User[]>(this.baseUrl + 'user', { observe: 'response', params })
      .pipe(map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }));
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'user/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'user/' + id, user)
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'user/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'user/' + userId + '/photos/' + id);
  }

}
