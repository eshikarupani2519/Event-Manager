import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
selector: 'app-register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})

export class RegisterComponent {

registerForm: FormGroup;

loading = false;
successMessage = '';

interestOptions:string[] = [
'Technology',
'AI',
'Hackathon',
'Music',
'Startup',
'Business',
'Gaming',
'Sports',
'Photography',
'Travel'
];

selectedInterests:string[] = [];
constructor(private authService: AuthService,private router:Router){

this.registerForm = new FormGroup({

name: new FormControl('', Validators.required),

email: new FormControl('', [
Validators.required,
Validators.email
]),

phone: new FormControl('', Validators.required),

city: new FormControl('', Validators.required),

state: new FormControl('', Validators.required),

country: new FormControl('', Validators.required),

password: new FormControl('', [
Validators.required,
Validators.minLength(6)
]),

interests: new FormControl([], Validators.required)

});

}

toggleInterest(interest:string){

const index = this.selectedInterests.indexOf(interest);

if(index === -1){

this.selectedInterests.push(interest);

}else{

this.selectedInterests.splice(index,1);

}

this.registerForm.get('interests')?.setValue(this.selectedInterests);

}

removeInterest(interest:string){

this.selectedInterests = this.selectedInterests.filter(i => i !== interest);

this.registerForm.get('interests')?.setValue(this.selectedInterests);

}

onSubmit(){

if(this.registerForm.invalid){
return;
}

this.loading = true;

const formData = {
...this.registerForm.value,
interests: JSON.stringify(this.selectedInterests)
};

this.authService.registerUser(formData).subscribe({

next:(res)=>{

this.loading = false;

this.successMessage = "🎉 Registration successful!";

this.registerForm.reset();
this.selectedInterests = [];
this.router.navigate(['/']);

},

error:(err)=>{

this.loading = false;

alert("Registration failed");

}

});

}

}