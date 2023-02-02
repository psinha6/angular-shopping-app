import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs";
import { Recipe } from "src/app/recipes/recipe.model";
import { RecipeService } from "src/app/recipes/recipe.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(private http: HttpClient, private recipeService: RecipeService) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put("https://angular-shopping-app-8c0c2-default-rtdb.firebaseio.com/recipes.json", recipes)
        .subscribe((response) => {
            console.log(response);
        })
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>("https://angular-shopping-app-8c0c2-default-rtdb.firebaseio.com/recipes.json")
        .pipe(map(recipes => {
            return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            })
        }),tap((recipes: Recipe[]) => {
            this.recipeService.setRecipes(recipes);
        }))
    }

}