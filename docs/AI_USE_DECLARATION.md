# AI Use Declaration

The brief says honest, detailed declarations are respected and hidden use is not. **Fill in the last column yourself, truthfully.**
I (the assistant) can only describe what the AI produced; only you know what you wrote, changed, ran and checked.

| AI tool | What I asked it to do | What I wrote, changed or checked myself |
|---|---|---|
| Claude (Anthropic) | Planned the app (a deadline manager for students) and generated the first version of the Spring Boot back end: task entity, REST API, smart priority score, repository and service classes | **FILL IN** (e.g. which parts you read and can explain, anything you changed, what you ran and observed) |
| Claude (Anthropic) | Generated the HTML, CSS and JavaScript front end: task list, form, dashboard, filters | **FILL IN** |
| Claude (Anthropic) | Added user accounts with hashed passwords, a calendar view, automatic 9:00 AM / 8:00 PM reminders and notifications | **FILL IN** |
| Claude (Anthropic) | Reworked the code to meet the brief: `BaseEntity` and `ScoringStrategy` (inheritance / interface), custom exception classes, input validation, no hard-coded secrets, search with a live counter, loading and error messages | **FILL IN** |
| Claude (Anthropic) | Wrote the JUnit tests (24), the Dockerfile and compose files, the README and these documents | **FILL IN** (e.g. you ran `mvn test` and saw it pass) |
| Claude (Anthropic) | Tested the front end in a headless browser against a stand-in server and made the screenshots in `docs/screenshots/` | **FILL IN** (e.g. you took your own screenshots from the real app) |
| Maven / Spring Boot / H2 etc. | These are libraries, not AI. Listed only so nobody confuses them with AI help. | n/a |

## Honest notes you may want to include
- Most of the code in this project was written by the AI from my prompts. (Say so plainly if true.)
- Things I can explain without help: (list them. Practise this before the video.)
- Things I tested on real people: see `docs/USER_TESTING.md`.
- Anything I changed after reading the code: (list files and why.)
