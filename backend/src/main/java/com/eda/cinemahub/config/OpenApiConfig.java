package com.eda.cinemahub.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI cinemaHubOpenAPI() {

        return new OpenAPI()

        .info(new Info()

                .title("CinemaHub REST API")

                .description("""
                        CinemaHub is a RESTful movie ticketing API.

                        Features:
                        - Movie Management
                        - Hall Management
                        - ShowTime Management
                        - Seat Management
                        - Ticket Management
                        - Authentication
                        """)

                .version("v1.0")

                .contact(new Contact()

                        .name("Eda Akkuş")

                        .email("eda@example.com")))

        // JWT Security
        .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))

        .components(new Components()
                .addSecuritySchemes("Bearer Authentication",
                        new SecurityScheme()
                                .name("Bearer Authentication")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))

        .externalDocs(new ExternalDocumentation()

                .description("CinemaHub Documentation")

                .url("https://github.com/edaakkus"));
    }
}