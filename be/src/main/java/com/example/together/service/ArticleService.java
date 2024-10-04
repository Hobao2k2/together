package com.example.together.service;


import com.example.together.dto.request.ArticleRequest;
import com.example.together.dto.response.ArticleResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ArticleService {
    public List<ArticleResponse> getArticles(Integer index, ArticleRequest request)
    {
        List<ArticleResponse> articles = new ArrayList<>();

    }
}
