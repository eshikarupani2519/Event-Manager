import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn:any=false;
constructor(private router:Router){}
ngOnInit(){
  // this.isLoggedIn=localStorage.getItem('eventLoggedIn');
  const loginStatus = localStorage.getItem("eventLoggedIn");
  this.isLoggedIn = loginStatus === "true";
  
}
navigateToPage(page:string){
  this.router.navigate([page]);
}

logout(){

localStorage.removeItem("token");
localStorage.removeItem("eventLoggedIn");

this.isLoggedIn = false;

this.router.navigate(['/']);

}
}



