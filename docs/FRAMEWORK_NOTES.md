# What the frameworks do for me (for the video)

The brief says: *"in your video you must explain what the framework is doing for you."* Use this page as your notes.
Read each part, then say it in your own words while showing the matching file.

## Spring Boot (Java)

| Without Spring Boot I would have to... | Spring Boot does it for me | Where to show it |
|---|---|---|
| Start an HTTP server and parse every request by hand | Starts an embedded Tomcat server on port 8080 | `TaskManagerApplication.java` (one `main` method) |
| Write code to route `GET /api/tasks` to a Java method | `@RestController`, `@GetMapping`, `@PostMapping`... map URLs to methods | `TaskController.java` |
| Convert Java objects to JSON and JSON back to objects | Jackson does it automatically (`@RequestBody`, return values) | `TaskController.create(...)` |
| Create objects and pass them to each other (`new TaskService(new TaskRepository(...))`) | **Dependency injection**: it builds `TaskService`, `SmartScorer`... and hands them over through constructors | `TaskService` constructor |
| Write SQL for every save / find / delete | **Spring Data JPA**: I only declare an interface; it writes the SQL | `TaskRepository.java` (`findByUserId(...)`) |
| Create the database tables | Hibernate builds the tables from my classes (`@Entity`) | `Task.java`, `User.java`, `spring.jpa.hibernate.ddl-auto=update` |
| Check inputs by hand | `@Valid` + `@NotBlank`, `@Size`... reject bad input before my code runs | `Task.java`, `RegisterRequest.java` |
| Handle errors one by one | `@RestControllerAdvice` turns every exception into a JSON message | `ApiExceptionHandler.java` |
| Read passwords/keys safely | Reads settings from `application.properties` and environment variables | `application.properties` |
| Build and run | `mvn spring-boot:run` builds, starts and serves the frontend files in `static/` | `pom.xml` |

**One sentence summary:** *Spring Boot handles the plumbing (server, URLs, JSON, database, wiring objects together), so my own code
can focus on the rules: scoring, validation and accounts.*

## BCrypt (`spring-security-crypto`)
Only used to hash passwords. A password is turned into a one-way scrambled string, so even I cannot read users' passwords.
Show: `SecurityBeans.java` and the `password_hash` column in the database.

## JUnit 5 (testing)
Runs my `@Test` methods and tells me which pass or fail. Show: `mvn test` and `src/test/java/...`.

## Maven
Downloads the libraries listed in `pom.xml` and builds the project. Show: `pom.xml` dependencies.

## Frontend
No framework: plain HTML, CSS and JavaScript (`static/` folder). Say that on purpose: *"I chose not to use React, so I used the DOM directly:
`document.getElementById`, `addEventListener`, `fetch`..."* Show the `loadTasks()` and `api()` functions in `app.js`.

## Docker (bonus)
Packages the app and Java together so it runs the same on any computer. Show: `Dockerfile` (stage 1 builds, stage 2 runs).
