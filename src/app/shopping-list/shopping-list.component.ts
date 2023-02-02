import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/models/ingredient.model';
import { ShoppingSerivce } from './shopping.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private idChangeSub!: Subscription;

  constructor(private shoppingService: ShoppingSerivce) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingService.getIngredients();
    this.idChangeSub = this.shoppingService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    });
  }
  onIngredientAdded(ingredient: Ingredient) {
    this.shoppingService.addIngredient(ingredient)
  }

  onEditItem(index: number) {
    this.shoppingService.startedEditing.next(index);
  }

  ngOnDestroy() {
    this.idChangeSub.unsubscribe();
  }

}
