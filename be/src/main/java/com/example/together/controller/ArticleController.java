package com.example.together.controller;


import com.example.together.dto.request.ArticleRequest;
import com.example.together.dto.response.ApiResponse;
import com.example.together.dto.response.ArticleResponse;
import com.example.together.dto.response.UserResponse;
import com.example.together.service.ArticleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ArticleController {
    ArticleService articleService;

    @GetMapping("/{index}")
    ApiResponse<List<ArticleResponse>> getUser(@PathVariable("index") Integer index, @RequestBody ArticleRequest request) {

        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.getArticles(index, request))
                .build();
    }

}
