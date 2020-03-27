import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import {TimeAgoPipe} from 'time-ago-pipe';

import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { AuthGuard } from './_guards/auth.guard';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditComponent } from './members/photo-edit/photo-edit.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';



export function tokenGetter(){
   return localStorage.getItem('token');
}

export class CustomHammerConfig extends HammerGestureConfig  {
   overrides = {
       pinch: { enable: false },
       rotate: { enable: false }
   };
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      MemberDetailComponent,
      MemberCardComponent,
      ListsComponent,
      MessagesComponent,
      MemberEditComponent,
      PhotoEditComponent,
      MemberMessagesComponent,
      TimeAgoPipe
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      NgxGalleryModule,      
      JwtModule.forRoot({
         config: {
            tokenGetter : tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes:['localhost:5000/api/auth']
         }
      }),
      TabsModule.forRoot(),
      FileUploadModule,
      BsDatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      ButtonsModule.forRoot()
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AuthGuard,
      MemberDetailResolver,
      MemberListResolver,
      { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
      MemberEditResolver,
      ListsResolver,
      MessagesResolver,
      PreventUnsavedChanges
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
