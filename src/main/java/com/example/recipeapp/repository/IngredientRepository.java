// IngredientRepository.java
package com.example.recipeapp.repository;

import com.example.recipeapp.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    Optional<Ingredient> findByName(String name);

    @Query(value = "SELECT * FROM ingredient WHERE MATCH (name) AGAINST (?1 IN NATURAL LANGUAGE MODE)", nativeQuery = true)
    List<Ingredient> searchIngredients(String query);
}