// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDCVRZOkrL7mgJZhxpZllVElbt8RfyH31c",
    authDomain: "kids-reloaded.firebaseapp.com",
    databaseURL: "https://kids-reloaded-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kids-reloaded",
    storageBucket: "kids-reloaded.appspot.com",
    messagingSenderId: "225689018043",
    appId: "1:225689018043:web:63415fcbacca4d32f5939e",
    measurementId: "G-MSEZVCGCRV"
    },

  shareableURL: 'localhost:4200',
  isDeployment: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
