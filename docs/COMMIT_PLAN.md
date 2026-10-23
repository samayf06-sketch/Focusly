# Git commits: a plan that keeps your history honest

The brief wants commits on **at least 6 different days** over the 15 days, to see your work grow.

**Do not fake or backdate commits.** The history must show when you really did the work. The project already exists, so
make your commits from now on reflect real work **you** do. Here is a realistic list. Spread it over different days:

| Day | Real work you do | Example commit message |
|---|---|---|
| 1 | Create the GitHub repo, add the project, README and `.gitignore`, run it and confirm it works | `Add project, README and .gitignore` |
| 2 | Read the back end code and write your own comments on the parts you studied | `Add comments explaining scoring and services` |
| 3 | Run `mvn test`; write 2 more tests of your own (for example for `TaskValidator`) | `Add extra unit tests` |
| 4 | Test with your first 3 real users and write the notes in `docs/USER_TESTING.md` | `Add user testing notes (round 1)` |
| 5 | Make the change your users asked for | `Improve <thing> after user feedback` |
| 6 | Take your own screenshots from the running app and put them in the README | `Add screenshots to README` |
| 7 | Add Docker / try the Docker build | `Verify Docker build` |
| 8 | Deploy it (bonus) and add the link to the README | `Add live demo link` |
| 9 | Fill in `docs/AI_USE_DECLARATION.md` truthfully | `Complete AI use declaration` |

## Commands
```bash
git init                       # once
git add .
git commit -m "Add project, README and .gitignore"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main        # later: git add . ; git commit -m "..." ; git push
```
Check before every push that `.env` and the `data/` folder are **not** included (they are in `.gitignore`).
