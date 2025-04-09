import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Valida que las contraseñas coincidan, verificando primero que los controles existan
  passwordMatchValidator(form: FormGroup) {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');

    if (passwordControl && confirmPasswordControl && passwordControl.value === confirmPasswordControl.value) {
      return null;
    }
    return { mismatch: true };
  }

  onSubmit() {
    this.router.navigate(['/login'])
    if (this.registerForm.valid) {
      // Lógica para el registro (por ejemplo, llamar a un servicio)
      console.log('Datos de registro:', this.registerForm.value);
    } else {
      // Opcional: Mostrar mensajes de error o realizar alguna acción en caso de formulario inválido
      console.log('El formulario no es válido');
    }
  }
}
