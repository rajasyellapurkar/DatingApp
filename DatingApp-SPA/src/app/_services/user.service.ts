import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/paginated-result';
import { Message } from '../_models/message';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(pageNumber?, pageSize?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
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

    if(likesParam === 'Likers')
    {
      params = params.append('likers','true');
    }

    if(likesParam === 'Likees')
    {
      params = params.append('likees','true');
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

  sendLike(id: number, recipientId: number)
  {
    return this.http.post(this.baseUrl + 'user/' +  id + '/like/' + recipientId, {});
  }

  getMessages(id:number,page?, itemsPerPage?, messageContainer?)
  {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let params = new HttpParams();
    
    if (page != null && itemsPerPage != null)
    {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);      
    }

    if (messageContainer != null)
    {
      params = params.append('messageContainer', messageContainer);
    }

    return this.http.get<Message[]>(this.baseUrl + 'user/' + id + '/messages', {observe:'response', params})
                    .pipe(map(
                      response => {
                        paginatedResult.result = response.body;
                        if(response.headers.get('Pagination') != null)
                        {
                          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                        }

                        return paginatedResult;
                      }
                    ));
  }

  getMessagesThread(userId,recipientId)
  {
    return this.http.get<Message[]>(this.baseUrl + 'user/' + userId + '/messages/thread/' + recipientId);
  }

  sendMessage(userId:number, newMessage:Message)
  {
    return this.http.post(this.baseUrl + 'user/' + userId + '/messages',newMessage);
  }

  deleteMessage(userId: number, messagedId :number)
  {
    return this.http.post(this.baseUrl + 'user/' + userId + '/messages/' + messagedId, {});
  }

  markAsRead(userId:number,messageId:number)
  {
    this.http.post(this.baseUrl + 'user/' + userId + '/messages/' + messageId + '/read',{}).subscribe();
  }

}
