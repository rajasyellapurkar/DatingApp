import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent implements OnInit 
{
  @Input() photos: Photo[];

  uploader:FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMainPhoto: Photo;
  user :User;

  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private userService: UserService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader()
  {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'user/' + this.authService.decodeToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item,response,status,headers) =>{
      if(response){
        const res:Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description : res.description,
          isMain: res.isMain
        }; 
        if(photo.isMain)
        {
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
          this.authService.changeMemberPhotoUrl(photo.url);
        }
        this.photos.push(photo)
      }
    };

  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo:Photo)
  {
    this.userService.setMainPhoto(this.authService.decodeToken.nameid,photo.id).subscribe(
      ()=> {
        this.currentMainPhoto = this.photos.filter(p=> p.isMain === true)[0];
        this.currentMainPhoto.isMain = false;
        photo.isMain = true;
        this.user = JSON.parse(localStorage.getItem('user'));
        this.user.photoUrl = photo.url;
        localStorage.setItem('user',JSON.stringify(this.user));
        this.authService.changeMemberPhotoUrl(photo.url);
        this.alertify.success("Photo set to main successfully");        
      },
      err => {
        this.alertify.error("Operation failed" + err);
      }
    )
  }

  deletePhoto(id:number){
    this.alertify.confirm('Are you sure you want to delete', ()=>{
      this.userService.deletePhoto(this.authService.decodeToken.nameid,id)
      .subscribe(()=>{
        this.photos.splice(this.photos.findIndex(p=>p.id === id),1);
        this.alertify.success('Photo deleted successfully');
      },
      error => {
        this.alertify.error(error);
      });
    });

  }

}
