import { AuthService } from '@tt/auth';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  onSubmit() {
    if (this.form.valid) {
      // this.form.value
      this.authService.login(this.form.value as {username: string, password: string}).pipe(
        catchError(err => {
          if(err.status === 401){

            return throwError(() => 'Error: Incorrect login or password')
          }
          return err
        }),
        tap(() => {
          this.router.navigate([''])
        })
      ).subscribe();
    }
  }
}
