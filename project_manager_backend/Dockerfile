# syntax=docker/dockerfile:1

# -------------------------
# Build stage
# -------------------------
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Copy .env file if it exists (optional - environment variables take precedence)
COPY .env* ./

# Build the application
RUN mvn clean package -DskipTests


# -------------------------
# Production stage
# -------------------------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install runtime dependencies required by Netty QUIC + wget for healthcheck
RUN apk add --no-cache wget libgcc

# Create a non-root user
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Copy .env file if present
COPY --from=build /app/.env* ./

# Set ownership & switch user
RUN chown spring:spring app.jar
USER spring:spring

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
