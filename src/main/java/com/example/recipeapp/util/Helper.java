package com.example.recipeapp.util;

import lombok.experimental.UtilityClass;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@UtilityClass
public class Helper {

    public String decodeImageUrl(String s) {
        String decodedImageUrl;
        try {
            decodedImageUrl = URLDecoder.decode(s.split("=")[1], StandardCharsets.UTF_8);
        } catch (ArrayIndexOutOfBoundsException e) {
            decodedImageUrl = s;
        }
        return decodedImageUrl;
    }
}
