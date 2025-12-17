// RecipeController.java
package com.example.recipeapp.controller;

import com.example.recipeapp.domain.IngredientDto;
import com.example.recipeapp.domain.RecipeDto;
import com.example.recipeapp.entity.Recipe;
import com.example.recipeapp.entity.Ingredient;
import com.example.recipeapp.repository.IngredientRepository;
import com.example.recipeapp.repository.RecipeRepository;
import com.example.recipeapp.util.Helper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class RecipeController {

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private EntityManager entityManager;

    @GetMapping("/ingredients/search")
    public List<IngredientDto> searchIngredients(@RequestParam("query") String query) {
        return ingredientRepository.searchIngredients(query)
                .stream()
                .map(i -> new IngredientDto(i.getId(), i.getName()))
                .collect(Collectors.toList());
    }

    @PostMapping("/recipes/search")
    public List<RecipeDto> searchRecipes(@RequestBody List<Long> ingredientIds) {
        if (ingredientIds.isEmpty()) {
            return Collections.emptyList();
        }

        String sql = "SELECT r.*, COUNT(ri.ingredient_id) as match_count " +
                "FROM recipe r " +
                "JOIN recipe_ingredient ri ON r.id = ri.recipe_id " +
                "WHERE ri.ingredient_id IN (?1) " +
                "GROUP BY r.id " +
                "ORDER BY match_count DESC, r.ratings DESC";

        Query query = entityManager.createNativeQuery(sql, Recipe.class);
        query.setParameter(1, ingredientIds);

        @SuppressWarnings("unchecked")
        List<Recipe> recipes = query.getResultList();

        return recipes.stream().map(this::toDto).collect(Collectors.toList());
    }

    private RecipeDto toDto(Recipe r) {
        RecipeDto dto = new RecipeDto();
        dto.setTitle(r.getTitle());
        dto.setCook_time(r.getCookTime());
        dto.setPrep_time(r.getPrepTime());
        dto.setRatings(r.getRatings());
        dto.setCuisine(r.getCuisine());
        dto.setCategory(r.getCategory());
        dto.setAuthor(r.getAuthor());
        dto.setImage(Helper.decodeImageUrl(r.getImage()));
        dto.setIngredients(r.getIngredients().stream().map(Ingredient::getName).collect(Collectors.toList()));
        return dto;
    }

}