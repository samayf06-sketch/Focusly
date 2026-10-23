# Brief checklist: where each requirement is met

**Legend:** ✅ already in the project  ·  🧑 you must do it yourself

## Java: the brain
| Requirement | Status | Where |
|---|---|---|
| 4+ classes, encapsulation | ✅ | `Task`, `User`, `AuthToken`: private fields + getters/setters |
| Inheritance | ✅ | `Task` and `User` extend `BaseEntity`; all errors extend `ApiException` |
| Interface | ✅ | `ScoringStrategy` ← `SmartScorer` |
| Collections | ✅ | `List`/`ArrayList` (task lists, samples), `Map`/`TreeMap` (stats by subject), `Comparator` sorting in `TaskService` |
| Exception handling for wrong/missing input | ✅ | `TaskValidator`, `ApiException` family, `ApiExceptionHandler` |
| Data survives restart | ✅ | File database (H2) in `data/`; PostgreSQL / MySQL profiles |
| REST API with create/read/update/delete (4+ endpoints) | ✅ | `TaskController` (README lists all endpoints) |
| 5+ JUnit tests | ✅ | 24 tests in `src/test/java` (`mvn test`) |

## JavaScript: the face
| Requirement | Status | Where |
|---|---|---|
| Responsive HTML/CSS/JS | ✅ | `static/` (works on phone width) |
| DOM, events, form validation | ✅ | `app.js` (task form, login form) |
| `fetch()` + `async/await`, loading + error messages | ✅ | `api()` and `loadTasks()` in `app.js` (loading bar, error box with "Try again") |
| Smart feature | ✅ | Live search + counter, sort, smart priority ranking, calendar, reminders and notifications |

## Engineering habits
| Requirement | Status | Notes |
|---|---|---|
| GitHub repo with README (problem, run, screenshots, endpoints) | 🧑 / ✅ | README is written; **you** create the repo and push |
| Commits on 6+ different days | 🧑 | See `docs/COMMIT_PLAN.md`. History must be real |
| No passwords or keys in the code | ✅ | Secrets come from environment variables (`.env.example`) |
| Explain the framework in the video | 🧑 | Notes in `docs/FRAMEWORK_NOTES.md` |

## Compulsory and bonus
| Requirement | Status | Notes |
|---|---|---|
| Real-user test with 3+ people, one change from feedback | 🧑 | Template: `docs/USER_TESTING.md` |
| AI Use Declaration table | 🧑 / ✅ | Start in `docs/AI_USE_DECLARATION.md`; **you** fill the last column honestly |
| Bonus: hashed-password login | ✅ | BCrypt in `SecurityBeans`, `AuthService` |
| Bonus: Docker | ✅ | `Dockerfile`, `docker-compose*.yml` (try the build yourself) |
| Bonus: live deployment | 🧑 | README has deployment notes |
