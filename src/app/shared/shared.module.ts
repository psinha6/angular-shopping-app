import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./components/alert/alert.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { DropDownDirective } from "./direcitves/dropdown.directive";
import { PlaceholderDirective } from "./direcitves/placeholder.directive";

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent,
    DropDownDirective,
    PlaceholderDirective
  ],
  imports: [CommonModule],
  exports: [
    LoadingSpinnerComponent,
    AlertComponent,
    DropDownDirective,
    PlaceholderDirective,
    CommonModule
  ]
})
export class SharedModule {

}