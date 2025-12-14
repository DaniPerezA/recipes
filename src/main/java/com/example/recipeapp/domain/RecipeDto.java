// RecipeDto.java (for data loading and response)
package com.example.recipeapp.domain;

import lombok.Data;

import java.util.List;

@Data
public class RecipeDto {
    private String title;
    private int cook_time;
    private int prep_time;
    private List<String> ingredients;
    private double ratings;
    private String cuisine;
    private String category;
    private String author;
    private String image;
}