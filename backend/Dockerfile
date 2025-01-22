FROM openjdk:23-jdk-slim

WORKDIR /app

COPY build.gradle settings.gradle gradlew /app/
COPY gradle /app/gradle
COPY src /app/src

RUN ./gradlew bootJar

EXPOSE 8080

CMD ["java", "-jar", "/app/build/libs/movieweb-0.0.1-SNAPSHOT.jar"]
