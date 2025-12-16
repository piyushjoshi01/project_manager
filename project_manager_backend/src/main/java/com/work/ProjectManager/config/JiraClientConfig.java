package com.work.ProjectManager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class JiraClientConfig {

    @Bean
    public WebClient jiraWebClient() {
        return WebClient.builder()
                .baseUrl("https://piyushjoshi280601.atlassian.net/")
                .defaultHeaders(headers -> {
                    headers.setBasicAuth(
                            "${JIRA_EMAIL}",
                            "${JIRA_API_TOKEN}"
                    );
                    headers.add("Accept", "application/json");
                })
                .exchangeStrategies(
                        ExchangeStrategies.builder()
                                .codecs(c -> c.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                                .build()
                )
                .build();
    }
}
