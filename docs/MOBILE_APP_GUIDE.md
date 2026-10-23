# Publishing Focusly on Google Play and the App Store

The Android and iOS projects are already generated in the `mobile/` folder (made with **Capacitor**, which puts the website
inside a real app). What is left are the steps that need **your own accounts and computers**: hosting the server, building, signing and uploading.

## What it costs

| Store | Fee | You need |
|---|---|---|
| Google Play | **$25 once** | Windows, Mac or Linux with **Android Studio** |
| Apple App Store | **$99 per year** | A **Mac** with **Xcode** (there is no way around this) |

Hosting the Java server: free tiers (Render, Railway) work for testing. For real users, a small paid plan avoids sleeping servers.

## Step 1: Put the Java server online (required)

A phone cannot reach `localhost` on your PC, so the app needs an online server with **https**.

1. Push the project to GitHub.
2. On Render or Railway create a **Web Service** from the repo (it uses the `Dockerfile`) and a **PostgreSQL** database.
3. Set environment variables: `SPRING_PROFILES_ACTIVE=postgres`, `DB_URL`, `DB_USER`, `DB_PASSWORD`.
4. Open the `https://....` address and check you can register and log in.

The server already allows requests from the apps (`app.cors.allowed-origins`, default `https://localhost,capacitor://localhost,http://localhost`).

## Step 2: Point the app at your server

Edit `src/main/resources/static/js/config.js`:

```js
window.APP_CONFIG = { apiBase: 'https://your-server.onrender.com' };   // no slash at the end
```

Keep `apiBase` empty (`''`) for the normal website. Only the app needs the address.

## Step 3: Choose your app ID and name

In `mobile/capacitor.config.json` change `"appId": "com.yourname.focusly"` to something unique, such as `com.aarav.focusly`.
It can never be changed after you publish. Use lowercase letters and dots only.

## Step 4: Build the app files

You need **Node.js 18+**. In a terminal:

```bash
cd mobile
npm install
npm run sync          # copies the website into the apps
```

Run `npm run sync` again every time you change anything in `src/main/resources/static/`.

To regenerate icons after changing `mobile/resources/icon.png` (1024x1024) and `splash.png` (2732x2732): `npm run assets`.

## Step 5A: Android, Google Play

1. Install **Android Studio**. Run `npm run open:android`.
2. Let Gradle finish syncing. Test on an emulator or a phone with USB debugging (**Run** button).
3. In `mobile/android/app/build.gradle` set `versionCode 1` and `versionName "1.0"` (raise `versionCode` by 1 for every upload).
4. **Build → Generate Signed Bundle / APK → Android App Bundle**. Create a new keystore and **back it up safely** (lose it and you can never update the app). Never commit it to Git.
5. Create a [Google Play Console](https://play.google.com/console) account ($25) and verify your identity.
6. **Create app**, then fill in: store listing (name, short + full description, 512x512 icon, 2-8 phone screenshots, feature graphic 1024x500), **Privacy policy URL**, **Data safety** form, **Content rating** questionnaire, **Target audience**.
7. Upload the `.aab` to a release and submit.

Note: new personal developer accounts must run a **closed test with at least 12 testers for 14 days** before they can publish to production. Start that early.

**Data safety answers:** collects name and email (account management), app activity/user content (tasks); data is encrypted in transit; users can request deletion (Settings → Delete my account); no data shared with third parties; no ads.

## Step 5B: iOS, App Store

1. On a Mac install **Xcode** and **CocoaPods** (`sudo gem install cocoapods`). Run `cd mobile && npm run sync` then `npm run open:ios`.
2. In Xcode click the **App** project → **Signing & Capabilities** → choose your Team, and set the **Bundle Identifier** to your `appId`.
3. Join the [Apple Developer Program](https://developer.apple.com/programs/) ($99/year).
4. Test on a simulator or your iPhone.
5. **Product → Archive → Distribute App → App Store Connect**.
6. In [App Store Connect](https://appstoreconnect.apple.com) create the app record: name, subtitle, description, keywords, screenshots (6.7" and 6.5" iPhone sizes at least), **Privacy policy URL**, **App Privacy** answers (same as above), age rating.
7. Add the build, **Submit for Review** (usually 1-3 days).

## Things the stores check (already handled)

| Store rule | Where it is covered |
|---|---|
| In-app **account deletion** (Apple 5.1.1(v), Google Play) | Settings → Privacy & data → Delete my account (`DELETE /api/auth/me`) |
| **Privacy policy** link | `privacy.html`, linked on the login screen and in Settings |
| Apple 4.2 "not just a website" | The app uses native phone alarms (`@capacitor/local-notifications`) and works as a real installed app |
| Notification permission asked at the right time | After the person taps a button (never on first load) |
| No secrets in the app | Only the public server address is in `config.js` |

## Before you submit: fill these in

1. `privacy.html`: replace `YOUR_EMAIL@example.com` with a real contact email. Host the page publicly (it is served at `https://your-server/privacy.html`).
2. Take real screenshots from the running app on a phone or emulator.
3. Test on a **real phone**: register, add tasks, close the app and check the 9:00 AM / 8:00 PM alarm rings (to test sooner, temporarily change the times in `REMINDER_SLOTS` in `js/app.js`).
4. Make sure **everything works with the server online**, and that you can delete an account.

## If something goes wrong

| Problem | Fix |
|---|---|
| App shows "Cannot reach the server" | `apiBase` in `config.js` is wrong or empty. Fix, then `npm run sync`, rebuild |
| Login works in browser but not in the app | The server address must be **https**; check `app.cors.allowed-origins` |
| Alarm does not ring on Android 13+ | Allow notifications when asked; also check battery optimisation for the app |
| `pod install` error on Mac | `sudo gem install cocoapods`, then `cd mobile/ios/App && pod install` |
| Changes to the website do not appear | You forgot `npm run sync` |

## Honest limits

- Alarms (9:00 AM and 8:00 PM) are scheduled 14 days ahead and refreshed whenever the app is opened, so open it now and then.
- Push notifications from the server (when the app has never been opened) are not included; that would need Firebase and Apple push setup.
- The Java server, the Android build and the iOS build could not be compiled in the environment this was made in. Run `mvn test` first and test on a real device before you submit.
