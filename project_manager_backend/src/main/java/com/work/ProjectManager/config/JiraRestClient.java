package com.work.ProjectManager.config;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JiraRestClient {

    private final WebClient jiraWebClient;

    public <T> Mono<T> get(String endpoint, Class<T> responseType) {
        return jiraWebClient.get()
                .uri(endpoint)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(error -> Mono.error(new RuntimeException(error)))
                )
                .bodyToMono(responseType);
    }

    public <T> Mono<T> getWithQueryParams(String endpoint, java.util.Map<String, String> queryParams, Class<T> responseType) {
        return jiraWebClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path(endpoint);
                    queryParams.forEach(builder::queryParam);
                    return builder.build();
                })
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(error -> Mono.error(new RuntimeException(error)))
                )
                .bodyToMono(responseType);
    }

    public <T, R> Mono<T> post(String endpoint, R requestBody, Class<T> responseType) {
        return jiraWebClient.post()
                .uri(endpoint)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(error -> Mono.error(new RuntimeException(error)))
                )
                .bodyToMono(responseType);
    }
}
