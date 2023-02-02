import { Subject } from 'rxjs';
import { Ingredient } from "../shared/models/ingredient.model";

export class ShoppingSerivce {
    ingredientsChanged = new Subject<Ingredient[]>()
    startedEditing = new Subject<number>()
    ingredients: Ingredient[] = [new Ingredient('Apples', 5), new Ingredient('Oranges', 10)];
    
    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }
    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredients(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    addIngredient(ingredient: Ingredient) {
      this.ingredients.push(ingredient);
      this.ingredientsChanged.next(this.ingredients.slice())
    }

    addIngredients(ingredient: Ingredient[]) {
        this.ingredients.push(...ingredient);
        this.ingredientsChanged.next(this.ingredients);
    }
}