# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurrly Expo app. Here is a summary of every change made:

- **`app.config.js`** (new) — Dynamic Expo config that extends `app.json` and injects `posthogProjectToken` and `posthogHost` into `Constants.expoConfig.extra` at build time from environment variables.
- **`lib/posthog.ts`** (new) — PostHog client singleton initialised with `expo-constants`, guarded so a missing token silently disables tracking in production and warns loudly in development.
- **`app/_layout.tsx`** — Wrapped the app in `PostHogProvider` (inside `ClerkProvider`). Added manual screen tracking via `posthog.screen()` on each pathname change. Added a `ClerkPostHogIdentifier` component that calls `posthog.identify(userId)` whenever Clerk reports an authenticated user — keeping anonymous and identified sessions correlated.
- **`app/(auth)/sign-in.tsx`** — Captures `user_signed_in` with `method: 'password'` inside the Clerk `finalize` navigate callback, after successful authentication.
- **`app/(auth)/sign-up.tsx`** — Captures `user_signed_up` with `method: 'email'` inside the Clerk `finalize` navigate callback, after email verification completes.
- **`app/(tabs)/settings.tsx`** — Captures `user_signed_out` and calls `posthog.reset()` before Clerk's `signOut()`, so the session identity is cleared correctly.
- **`app/(tabs)/index.tsx`** — Captures `subscription_expanded` (with `subscription_id`) when a user taps a subscription card on the home screen to reveal its details.
- **`app/(tabs)/subscriptions.tsx`** — Captures `subscription_list_viewed` on mount, marking entry into the subscriptions browse funnel.
- **`app/subscriptions/[id].tsx`** — Captures `subscription_viewed` (with `subscription_id`) when a specific subscription detail page is opened.
- **`app/onboarding.tsx`** — Captures `onboarding_viewed` on mount, marking the top of the new-user activation funnel.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- **`.env.example`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` placeholder entries for collaborators.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with email and password via Clerk. | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User successfully creates a new account and completes email verification. | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User signs out of their account from the Settings screen. | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User taps a subscription card on the home screen to expand its details. | `app/(tabs)/index.tsx` |
| `subscription_list_viewed` | User views the full subscriptions list tab. | `app/(tabs)/subscriptions.tsx` |
| `subscription_viewed` | User opens a specific subscription detail page. | `app/subscriptions/[id].tsx` |
| `onboarding_viewed` | User enters the onboarding screen (top of the new-user funnel). | `app/onboarding.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/234191/dashboard/854323)
- [Sign-ups & sign-ins over time](https://eu.posthog.com/project/234191/insights/z4DZpXuE)
- [Onboarding-to-signup funnel](https://eu.posthog.com/project/234191/insights/Swg8Tice)
- [User sign-outs (churn signal)](https://eu.posthog.com/project/234191/insights/N0gcaX8F)
- [Subscription engagement](https://eu.posthog.com/project/234191/insights/3PM9ZCZv)
- [Subscription list views](https://eu.posthog.com/project/234191/insights/AUPnF1s8)

## Verify before merging

- [ ] **Install the SDK** — The sandbox environment couldn't reach the npm registry during this run. Before building, run: `npx expo install posthog-react-native react-native-svg`
- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to any monorepo/bootstrap scripts or CI secrets so collaborators and build pipelines know what to set. Both keys are already in `.env.example`.
- [ ] Confirm the returning-visitor path also calls `identify` — the `ClerkPostHogIdentifier` component in `_layout.tsx` handles this automatically whenever Clerk reports a `userId`, including on app resume and session restore.
- [ ] **Clerk data source detected** — Recurrly uses Clerk for authentication. Run `npx @posthog/wizard warehouse` to connect Clerk to PostHog's data warehouse and enrich person profiles with Clerk user data.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
