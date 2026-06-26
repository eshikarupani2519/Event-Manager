import { Component } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user:any;
  events:any[]=[];

  constructor(private profileService:ProfileService){}

  ngOnInit(){

    this.profileService.getProfile().subscribe((data:any)=>{

      this.user = data.user;
      this.events = data.events;

    });

  }

}