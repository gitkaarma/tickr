# syntax=docker/dockerfile:1

# --- Build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Cache dependencies first
COPY pom.xml ./
RUN mvn -B -ntp dependency:go-offline
# Then build
COPY src ./src
RUN mvn -B -ntp -DskipTests clean package

# --- Runtime stage ---
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Render injects PORT; our app binds to it via server.port=${PORT:8080}
EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
