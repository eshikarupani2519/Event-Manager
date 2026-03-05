import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
currentUserName=''
  inValidCredentials: any = false;
 errorMessage:string=''
 ngOnInit(){
  localStorage.setItem('eventLoggedIn','false');
 }
  constructor(private router: Router,private http:HttpClient) { }
  loginForm = new FormGroup({
    password: new FormControl('',[Validators.required]),
    username: new FormControl('', [ Validators.required])
  })
showPassword(passwordField: HTMLInputElement, icon: HTMLElement){
   const isPassword = passwordField.type === 'password';
  passwordField.type = isPassword ? 'text' : 'password';
  icon.classList.toggle('fa-eye');
  icon.classList.toggle('fa-eye-slash');
  // classList.toggle() adds the class if it’s not present, or removes it if it is.
  }
  getFormControl(name: string) {
    return this.loginForm.get(name)
  }
  isFormControlError(name: string) {
    return this.loginForm.get(name)?.invalid && this.loginForm.get(name)?.dirty
  }
  isEmailValid(email: string) {
    return this.loginForm.get(email)?.invalid && this.loginForm.get(email)?.touched
  }
  isRequired(name: string) {
    return this.loginForm.get(name)?.touched && this.loginForm.get(name)?.errors?.['required']
  }
  submitForm() {
    console.log(this.loginForm.value)
    
    this.validateLogin()
  }
validateLogin() {
      if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials.';
      return;
    }

    const { username, password} = this.loginForm.value;
 
    this.http.post(`${environment.apiUrl}/login`, { username, password }, {headers: { 'Content-Type': 'application/json' }})
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          
           localStorage.setItem('eventLoggedIn','true');
          this.router.navigate(['/dashboard']); 
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Login failed';
          alert(this.errorMessage)
        }
      });
    }
  

}
