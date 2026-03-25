import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { url } from '../shared/tools/global-url';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  router = inject(Router);

  token: string | null = null;
  refreshToken: string | null = null;


  get isAuth() {

    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !!this.token;
  }

  login(payload: { username: string; password: string}) {
    const fd = new FormData();

    fd.append('username', payload.username);
    fd.append('password', payload.password);

    return this.http
      .post<TokenResponse>(`${url}auth/token`, fd)
      .pipe(tap((val) => this.savesTokens(val)));
  }

  refreshAuthToken() {
    return this.http
      .post<TokenResponse>(`${url}auth/refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((val) => this.savesTokens(val)),
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      );
  }

  logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['']);
  }

  savesTokens(res: TokenResponse) {
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;

    this.cookieService.set('token', this.token);
    this.cookieService.set('refreshToken', this.refreshToken);
  }
}
