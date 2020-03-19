import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtService } from './_services/jwt.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'DatingApp';
  
  constructor(private authService:AuthService, private jwtService: JwtService){}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if(token)
    {
      this.authService.decodeToken = this.jwtService.decodeToken(token);
    }
    if(user)
    {
      this.authService.changeMemberPhotoUrl(user.photoUrl);
    }
  }
}
