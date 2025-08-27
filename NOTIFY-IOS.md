# iOS Push Notifications (Capacitor + FCM via APNs)

This guide enables push notifications for iOS builds using Capacitor 7 and Firebase Cloud Messaging (FCM). The server-side uses the existing FCM v1 sender (`lib/notify/notify-firebase.ts`).

## Prerequisites
- Apple Developer account
- Firebase project (add iOS app)
- Capacitor 7.x (already in package.json)

## Install plugins

```bash
npm i @capacitor/push-notifications @capacitor-firebase/messaging
npx cap sync
```

## Xcode capabilities
1) Open iOS project: `npm run open:ios`.
2) Target → Signing & Capabilities → Add:
   - Push Notifications
   - Background Modes → Remote notifications

## Firebase config
1) Download `GoogleService-Info.plist` from Firebase Console → iOS app.
2) Add to Xcode: `ios/App/App/GoogleService-Info.plist` (Ensure “Copy items if needed”).

## AppDelegate updates (done)
`ios/App/App/AppDelegate.swift` updated to:
- set `UNUserNotificationCenter.current().delegate`
- call `application.registerForRemoteNotifications()`
- forward registration callbacks to Capacitor via `NotificationCenter` posts

## Request permission + get token (runtime)
Handled in `components/notify.tsx` for native platforms via `@capacitor-firebase/messaging`:
- Requests notification permission
- Retrieves FCM token and stores it to `notification_permissions` with `provider: 'firebase'`

## Build and run
```bash
npm run build:ios
npm run open:ios
```
Run on a physical device (Push won’t work on iOS simulators).

## APNs key in Firebase
- In Firebase Console → Project Settings → Cloud Messaging → Apple app configuration.
- Upload APNs Authentication Key (.p8) or certificates, and set Team ID & Key ID.

## Testing plan (use app/hasyx/diagnostics)
- Open `app/hasyx/diagnostics` → Notification card.
- Steps:
  1. Launch iOS app on device; allow push permission.
  2. The Notification card should list a `firebase` provider permission.
  3. Enter title/body → select the provider → Send.
  4. Receive system notification; tap to open app (URL from FCM payload `fcm_options.link`).
- If no notification arrives:
  - Check `GoogleService-Info.plist` location.
  - Verify APNs key/certificates configured in Firebase.
  - Ensure device token stored in `notification_permissions`.
  - Inspect server `/api/events/notify` logs and Hasura Event delivery.

## Notes
- You can extend the FCM v1 payload with `apns` options (e.g., sound, badge) inside `lib/notify/notify-firebase.ts` using `permission.device_info` to branch for iOS.
