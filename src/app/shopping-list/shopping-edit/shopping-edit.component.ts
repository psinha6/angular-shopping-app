import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/models/ingredient.model';
import { ShoppingSerivce } from '../shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  editMode = false;
  editItemIndex!: number;
  editedItem!: Ingredient;

  @ViewChild('f') shoppingListForm!: NgForm;
  @ViewChild('nameInput', {static: true}) nameInputRef!: ElementRef;
  @ViewChild('amountInput', {static: true}) amountInput!: ElementRef;
  @Output() ingredientAdded = new EventEmitter<Ingredient>();
  constructor(private shoppingSerivce: ShoppingSerivce) { }

  ngOnInit(): void {
    this.subscription = this.shoppingSerivce.startedEditing.subscribe((data) => {
      this.editMode = true;
      this.editItemIndex = data;
      this.editedItem = this.shoppingSerivce.getIngredient(this.editItemIndex);
      this.shoppingListForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    })
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingSerivce.deleteIngredients(this.editItemIndex);
    this.onClear();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppingSerivce.updateIngredient(this.editItemIndex, newIngredient);
    } else {
      this.shoppingSerivce.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
