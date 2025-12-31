package com.work.ProjectManager.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class JiraClientConfig {

    private String jiraBaseUrl;
    private String jiraEmail;
    private String jiraApiToken;

    @Value("${jira.base-url:https://piyushjoshi280601.atlassian.net/}")
    private String baseUrlProperty;

    @Value("${JIRA_EMAIL:}")
    private String emailProperty;

    @Value("${JIRA_API_TOKEN:}")
    private String tokenProperty;

    @PostConstruct
    public void loadEnvFile() {
        // Load .env file if it exists
        Dotenv dotenv = null;
        try {
            dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();
        } catch (Exception e) {
            // .env file not found, use environment variables or defaults
        }

        // Priority: .env file > environment variables > application.properties > defaults
        if (dotenv != null) {
            jiraEmail = dotenv.get("JIRA_EMAIL");
            jiraApiToken = dotenv.get("JIRA_API_TOKEN");
            String envBaseUrl = dotenv.get("JIRA_BASE_URL");
            
            if (envBaseUrl != null && !envBaseUrl.isEmpty()) {
                jiraBaseUrl = envBaseUrl;
            } else {
                jiraBaseUrl = baseUrlProperty;
            }
        } else {
            // Use environment variables or properties
            jiraEmail = emailProperty;
            jiraApiToken = tokenProperty;
            jiraBaseUrl = baseUrlProperty;
        }

        // Fallback to system environment variables if .env values are null or empty
        if (jiraEmail == null || jiraEmail.isEmpty()) {
            jiraEmail = System.getenv("JIRA_EMAIL");
        }
        if (jiraApiToken == null || jiraApiToken.isEmpty()) {
            jiraApiToken = System.getenv("JIRA_API_TOKEN");
        }
        if (jiraBaseUrl == null || jiraBaseUrl.isEmpty()) {
            String envBaseUrl = System.getenv("JIRA_BASE_URL");
            jiraBaseUrl = (envBaseUrl != null && !envBaseUrl.isEmpty()) ? envBaseUrl : baseUrlProperty;
        }
    }

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient jiraWebClient() {
        // Allow app to start without Jira credentials (for tests and development)
        if (jiraEmail == null || jiraEmail.isEmpty() || jiraApiToken == null || jiraApiToken.isEmpty()) {
            System.out.println("WARNING: JIRA_EMAIL and JIRA_API_TOKEN not configured. Jira integration will not work.");
            return WebClient.builder()
                    .baseUrl(jiraBaseUrl != null && !jiraBaseUrl.isEmpty() ? jiraBaseUrl : "https://example.com")
                    .defaultHeaders(headers -> {
                        headers.add("Accept", "application/json");
                    })
                    .exchangeStrategies(
                            ExchangeStrategies.builder()
                                    .codecs(c -> c.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                                    .build()
                    )
                    .build();
        }

        return WebClient.builder()
                .baseUrl(jiraBaseUrl)
                .defaultHeaders(headers -> {
                    headers.setBasicAuth(jiraEmail, jiraApiToken);
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
