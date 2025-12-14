// RecipeAppApplication.java
package com.example.recipeapp;

import com.example.recipeapp.domain.RecipeDto;
import com.example.recipeapp.entity.Ingredient;
import com.example.recipeapp.entity.Recipe;
import com.example.recipeapp.repository.IngredientRepository;
import com.example.recipeapp.repository.RecipeRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class RecipeApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecipeApplication.class, args);
    }

    @Bean
    CommandLineRunner loadData(RecipeRepository recipeRepository, IngredientRepository ingredientRepository) {
        return args -> {
            if (recipeRepository.count() == 0) {
                ObjectMapper mapper = new ObjectMapper();
                TypeReference<List<RecipeDto>> typeRef = new TypeReference<>() {};
                // Assume recipes.json is placed in src/main/resources
                List<RecipeDto> dtos = mapper.readValue(new File("src/main/resources/recipes.json"), typeRef);
                for (RecipeDto dto : dtos) {
                    Recipe recipe = new Recipe();
                    recipe.setTitle(dto.getTitle());
                    recipe.setCookTime(dto.getCook_time());
                    recipe.setPrepTime(dto.getPrep_time());
                    recipe.setRatings(dto.getRatings());
                    recipe.setCuisine(dto.getCuisine());
                    recipe.setCategory(dto.getCategory());
                    recipe.setAuthor(dto.getAuthor());
                    recipe.setImage(dto.getImage());

                    List<Ingredient> ings = new ArrayList<>();
                    for (String ingName : dto.getIngredients()) {
                        Ingredient ing = ingredientRepository.findByName(ingName).orElseGet(() -> {
                            Ingredient newIng = new Ingredient();
                            newIng.setName(ingName);
                            return ingredientRepository.save(newIng);
                        });
                        ings.add(ing);
                    }
                    recipe.setIngredients(ings);
                    recipeRepository.save(recipe);
                }
            }
        };
    }
}