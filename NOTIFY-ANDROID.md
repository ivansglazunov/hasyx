# Android Push Notifications (Capacitor + FCM)

This guide enables push notifications for Android builds using Capacitor 7 and Firebase Cloud Messaging (FCM). It reuses the existing server-side FCM v1 sender in `lib/notify/notify-firebase.ts` and DB flow described in `NOTIFY.md`.

## Prerequisites
- Capacitor 7.x (already in package.json)
- Firebase project with Cloud Messaging enabled
- App ID: `com.hasyx.app` (from `capacitor.config.ts` / Android package)

## Install plugins

```bash
npm i @capacitor/push-notifications @capacitor-firebase/messaging
npx cap sync
```

Why both:
- `@capacitor-firebase/messaging` provides FCM token APIs on Android/iOS
- `@capacitor/push-notifications` handles runtime notification permissions on Android 13+

## Firebase config
1) Download `google-services.json` from Firebase Console → Android app (package: `com.hasyx.app`).
2) Place it at `android/app/google-services.json`.
3) Android Gradle already applies Google Services if the file exists (`android/app/build.gradle`).

## AndroidManifest
We set a default small icon (can be changed later):
```xml
<meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@mipmap/ic_launcher" />
```
Already added in `android/app/src/main/AndroidManifest.xml`.

## Code changes (done)
- `components/notify.tsx` detects Capacitor native platform and retrieves FCM token via `@capacitor-firebase/messaging`, storing it in `notification_permissions` (provider `firebase`).
- Web path remains for browser builds.

## Build and run
```bash
npm run build:android
npm run open:android
```
Run on a device or emulator with Play Services.

## Testing plan (use app/hasyx/diagnostics)
- Open `app/hasyx/diagnostics` → the Notification card.
- Steps:
  1. Launch the Android app; ensure internet access.
  2. The app requests notification permission (Android 13+). Allow it.
  3. The diagnostics Notification card should show at least one provider entry with `firebase` and a token masked.
  4. In the card, set title/body and select the provider permission → Send.
  5. Observe a system notification on the device. Tap it (should open the app URL set by FCM payload `fcm_options.link`).
- If no notification arrives:
  - Verify `google-services.json` present and correct.
  - Check device token is stored in `notification_permissions`.
  - Check server logs for `/api/events/notify` and `lib/events/notify.ts` processing.
  - Ensure Firebase project keys/env exist (`NEXT_PUBLIC_FIREBASE_*`, `GOOGLE_APPLICATION_CREDENTIALS`).

## Notes
- You can customize Android-specific FCM options by extending the `android` block in `lib/notify/notify-firebase.ts` payload.
- For custom small icon, add a white-on-transparent bitmap to `android/app/src/main/res/mipmap-*` and update the meta-data resource.
