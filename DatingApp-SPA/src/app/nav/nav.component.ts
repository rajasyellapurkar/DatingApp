import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any ={};
  photoUrl:string;

  constructor(public authService:AuthService, private alertify:AlertifyService, private router:Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(p=>{
      this.photoUrl = p;
    })
  }

  login(){
    this.authService.login(this.model).subscribe(
      next => {
        this.alertify.success('Logged in successfully');
      },
      error => {
        console.log(error);
        this.alertify.error('Failed to login: '+ error);
      },
      ()=>{
          this.router.navigate(['/members']);
      }
    );
  }

  isLoggedIn(){    
    return this.authService.loggedIn();
  }

  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodeToken = null;
    this.authService.currentUser = null;
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }

}
