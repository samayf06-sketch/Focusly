/* Where the app finds the Java server.
 *  - In a normal browser (served by Spring Boot) leave apiBase empty.
 *  - In the Android / iOS app, set it to your online server, for example:
 *        apiBase: 'https://focusly-api.onrender.com'
 *    (no slash at the end). `npm run sync` in the mobile/ folder copies this file into the app. */
window.APP_CONFIG = {
    apiBase: ''
};
