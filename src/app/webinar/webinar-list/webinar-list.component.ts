import { Component,OnInit } from '@angular/core';
import { WebinarService } from '../webinar.service';

@Component({
  selector: 'app-webinar-list',
  templateUrl: './webinar-list.component.html'
})
export class WebinarListComponent implements OnInit{

  webinars:any=[]

  constructor(private webinarService:WebinarService){}

  ngOnInit(){

    this.webinarService.getWebinars()
    .subscribe((res:any)=>{

      this.webinars = res

    })

  }

}