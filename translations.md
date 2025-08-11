### i18n checklist for browser TSX components

- Legend: [x] migrated and keys present, [ ] needs i18n migration, (n/a) no user-facing text

#### Components

- [x] `components/locale-switcher.tsx` — uses locale store and toggler (baseline)
- [x] `components/theme-switcher.tsx` — uses `useTranslations('theme')`
- [x] `components/sidebar/user-profile-dropdown.tsx` — uses `auth`, `common`, `tooltips`
- [x] `components/notify.tsx` — uses `notifications.*`
- [x] `components/files/example.tsx` — uses `files.example.*`
- [x] `components/files/files.tsx` — uses `files.status.*`
- [x] `components/room.tsx` — uses `messaging.*`
- [x] `components/entities/github_issues.tsx` — uses `actions`, `success`, `errors`, `common`
- [x] `components/entities/users.tsx` — migrated to `entities.users.*`
- [x] `components/entities/accounts.tsx` — migrated to `entities.accounts.*`
- (n/a) `components/sidebar.tsx` — renders navigation data; no static UI strings
- (n/a) `components/project-title-button.tsx`
- [x] `components/validation-form.tsx` — migrated to `validationDemo.*`
- [x] `components/client-layout.tsx` — provides NextIntl with `i18nMessages`
- (n/a) `components/locale-switcher-server.tsx` — server utility
- [x] `components/payments.tsx` — migrated to `payments.*`
- (n/a) `components/sidebar/layout.tsx`
- (n/a) `components/hover-card.tsx`
- [x] `components/hasyx/messaging/messaging.tsx` — already using `messaging.*`
- [x] `components/hasyx/users/accounts.tsx` — already using `accounts.*`
- (n/a) `components/files/files-zone.tsx`
- (n/a) `components/auth/telegram-login-button.tsx`
- [x] `components/auth/oauth-buttons.tsx` — migrated to `auth.common`, `auth.oauth`
- [x] `components/auth/auth-actions-card.tsx` — migrated to `auth`, `actions`, `errors`
- (n/a) `components/auth/provider-button.tsx`
- [x] `components/auth/jwt-debug-card.tsx` — migrated to `jwt.*`
- (n/a) `components/auth/credentials-signin-card.tsx`
- (n/a) `components/jwt-auth.tsx`
- [x] `components/auth/telegram-webapp-auth.tsx` — migrated to `auth.telegramWebapp.*`
- [x] `components/entities/default.tsx` — migrated to `entities.default.*`
- [x] `components/auth/session-card.tsx` — migrated to `session.*`
- (n/a) `components/pwa-install-prompt.tsx`
- [x] `components/pwa-install-prompt.tsx` — migrated to `pwa.*`
- [x] `components/auth/socket-auth-status.tsx` — migrated to `authStatus.ws.*`
- [x] `components/auth/get-auth-status.tsx` — migrated to `authStatus.get.*`
- (n/a) `components/users.tsx`
- [x] `components/users/users-subscription.tsx` — migrated to `usersList.*`
- [x] `components/users/users-query.tsx` — migrated to `usersList.*`
- [x] `components/users/users-card.tsx` — migrated to `usersList.*`
- [x] `components/hasyx/status.tsx` — migrated to `common.*`
- (n/a) `components/theme-provider.tsx`
- [x] `components/hasura/card.tsx` — migrated to `hasura.*`
- (n/a) `components/code-block.tsx`
- (n/a) `components/echarts.tsx`
- [x] `components/proxy/card.tsx` — migrated to `proxy.*`

#### Lib (client TSX)

- [x] `lib/config/react-jsonschema-form.tsx` — uses `config.*`
- (n/a) `lib/wysiwyg/index.tsx`
- (n/a) `lib/hasyx/hasyx-client.tsx`
- (n/a) `lib/constructor.tsx`
- (n/a) `lib/diagnostics.tsx`
- (n/a) `lib/entities.tsx`
- (n/a) `lib/pwa-diagnostics.tsx`
- (n/a) `lib/i18n/hook.tsx` — wrapper for next-intl
- (n/a) `lib/index.tsx` (if any; not part of scan)

#### App pages/components with 'use client'

- (n/a) `app/hasyx/hover-card/page.tsx`
- (n/a) `app/hasyx/hover-card/client.tsx`
- (n/a) `app/hasyx/shock-hook/page.tsx`
- (n/a) `app/hasyx/shock-hook/client.tsx`
- (n/a) `app/hasyx/config/page.tsx`
- (n/a) `app/hasyx/pwa/client.tsx`
- (n/a) `app/hasyx/doc/page.tsx`
- (n/a) `app/hasyx/doc/[filename]/client.tsx`

#### Notes

- Verified keys exist in both `i18n/en.json` and `i18n/ru.json` for checked items.
- Items marked [ ] contain hardcoded strings; migration should wrap texts with `useTranslations('<namespace>')` and add keys to both dictionaries.
- Generic UI primitives are marked (n/a) unless they render visible text.


