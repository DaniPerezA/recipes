// RecipeRepository.java
package com.example.recipeapp.repository;

import com.example.recipeapp.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {}