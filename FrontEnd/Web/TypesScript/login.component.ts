import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginPillComponent } from "../../components/login-pill/login-pill.component";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatIconModule, RouterModule, LoginPillComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });

  }

  onSubmit() {
    this.router.navigate(['pillbox/home'])
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
