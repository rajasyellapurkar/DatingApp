import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  registerModel:any ={};
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  user:User;
  
  constructor(private authService:AuthService, private alertify:AlertifyService,
    private fb:FormBuilder, private router: Router) { }

  ngOnInit() {    
  this.bsConfig = {
    containerClass: 'theme-red'
  }
   this.createRegistrationForm();
  }  

  createRegistrationForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: [null,Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['', [Validators.required,Validators.minLength(4)]],
      confirmPassword: ['',Validators.required]
    },{
      validators: [this.passwordMatchValidator]
    })
  }

  register()
  {
    if(this.registerForm.valid)
    {
      this.user = Object.assign({},this.registerForm.value);

     this.authService.register(this.user).subscribe(
        ()=> 
        {
          this.alertify.success('Registration is successfull');
        },
        err => {
          this.alertify.error("Registration failed: " + err);
        },
        ()=> {          
          this.authService.login(this.user).subscribe(()=>{
            this.router.navigate(['/members']);
          });
        }
      );
    }
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

  passwordMatchValidator(formGroup : FormGroup)
  {
    return formGroup.get('password').value === formGroup.get('confirmPassword').value ? null : {'mismatch' : true}
  }

}
