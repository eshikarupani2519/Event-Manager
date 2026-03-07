// import { Component,OnInit } from '@angular/core';
// import { WebinarService } from '../webinar.service';

// @Component({
//   selector: 'app-webinar-list',
//   templateUrl: './webinar-list.component.html'
// })
// export class WebinarListComponent implements OnInit{

//   webinars:any=[]

//   constructor(private webinarService:WebinarService){}

//   ngOnInit(){

//     this.webinarService.getWebinars()
//     .subscribe((res:any)=>{

//       this.webinars = res

//     })

//   }

// }

import { Component, OnInit } from '@angular/core';
import { WebinarService } from '../webinar.service';

@Component({
  selector: 'app-webinar-list',
  templateUrl: './webinar-list.component.html'
})
export class WebinarListComponent implements OnInit{

  webinars:any=[]

  constructor(private webinarService:WebinarService){}

  ngOnInit(){

    const token = localStorage.getItem("token")

    this.webinarService.getWebinars(token)
    .subscribe({
      next:(res:any)=>{
        this.webinars = res
      },
      error:(err)=>{
        console.log(err)
      }
    })

  }

}