FROM oraclelinux:8-slim
FROM openjdk:21-jdk
WORKDIR /app

COPY /target/together-0.0.1-SNAPSHOT.jar together.jar

EXPOSE 8080
CMD ["java", "-jar", "together.jar"]