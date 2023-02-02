import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "./user.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fireBaseApiKey}`,
      { email, password, returnSecureToken: true }
    ).pipe(catchError(errorResp => {
      return this.handleError(errorResp);
    }), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }))
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireBaseApiKey}`,
      { email, password, returnSecureToken: true }
    ).pipe(catchError(errorResp => {
      return this.handleError(errorResp);
    }), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  autoLogin() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return;
    }

    const localUser = JSON.parse(userData);
    const loadedUser = new User(localUser.email, localUser.id, localUser._token, new Date(localUser._tokenExpirationDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(localUser._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number) {
    const expiration = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expiration);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(errorResp: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errorMessage);
    }
    switch(errorResp.error.error.message) {
      case "EMAIL_EXISTS" : errorMessage = 'Email already exists'; break;
      case "INVALID_PASSWORD" : errorMessage = 'This password is not correct'; break;
      case "EMAIL_NOT_FOUND" : errorMessage = 'This email does not exist'; break;
    }
    return throwError(errorMessage)
  }

}