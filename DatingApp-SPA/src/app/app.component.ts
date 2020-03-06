import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtService } from './_services/jwt.service';

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
    if(token){
      this.authService.decodeToken = this.jwtService.decodeToken(token);
    }    
  }
}
