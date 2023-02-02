import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/components/alert/alert.component";
import { PlaceholderDirective } from "../shared/direcitves/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  form!: FormGroup;
  errorMessage!: string;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost!: PlaceholderDirective; 
  closeSub!: Subscription;

  constructor(private authService: AuthService,
    private router: Router,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    const email = this.form.value.email;
    const password = this.form.value.password;

    if (this.isLoginMode) {
      this.isLoading = false;
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe((response) => {
      console.log(response);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, error => {
      this.errorMessage = error;
      this.isLoading = false;
      this.showErrorAlert(error);
    })
    this.form.reset();
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.errorMessage = '';
  }
  
  private showErrorAlert(error: string) {
    const compRef = this.alertHost.viewContainerRef.createComponent(AlertComponent);
    compRef.instance.message = error;
    this.closeSub = compRef.instance.close.subscribe(() => {
      compRef.destroy();
      this.closeSub.unsubscribe();
    });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

}