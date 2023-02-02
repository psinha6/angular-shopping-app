import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { AuthGuardService } from "./auth/auth.guard.service";
import { AuthInterceptorService } from "./auth/auth.interceptor.service";
import { RecipeService } from "./recipes/recipe.service";
import { ShoppingSerivce } from "./shopping-list/shopping.service";

@NgModule({
    providers: [ShoppingSerivce, RecipeService, AuthGuardService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }]
})
export class CoreModule {

}