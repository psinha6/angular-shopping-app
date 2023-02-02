import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id!: number;
  constructor(private recipeSerivce: RecipeService,
    private router: ActivatedRoute,
    private route: Router) { }

  ngOnInit(): void {
    this.router.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeSerivce.getRecipe(this.id);
    })
  }

  onAddToShoppingList() {
    this.recipeSerivce.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.route.navigate(['edit'], {relativeTo: this.router});
  }

  onDelete() {
    this.recipeSerivce.deleteRecipe(this.id);
    this.route.navigate(['/recipes'])
  }

}
