# PaymentApp — Mobile

A React Native mobile app built with **Expo**, **TypeScript**, **React Navigation**, **TanStack Query**, and **Zustand**. Allows users to register, log in, send wallet-to-wallet payments, and view their transaction history.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Screens & Navigation](#screens--navigation)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Running on a Device / Simulator](#running-on-a-device--simulator)
- [Running Tests](#running-tests)
- [Build & Deployment](#build--deployment)
- [Architecture Decisions](#architecture-decisions)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

The mobile app provides:

- **Authentication** — Register and login with JWT tokens stored securely via `expo-secure-store`
- **Send Payments** — Enter a recipient's email and dollar amount; live email lookup shows if the recipient exists
- **Payment History** — Infinite-scroll list of all sent/received payments with pull-to-refresh
- **Payment Detail** — Full detail view of any individual payment
- **Profile** — View balance, add test funds (top-up), and logout

---

## Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Framework      | Expo SDK 51                              |
| Language       | TypeScript                               |
| Navigation     | React Navigation 6 (stack + bottom tabs) |
| State          | Zustand                                  |
| Server State   | TanStack Query v5                        |
| Forms          | React Hook Form + Zod                    |
| HTTP           | Axios                                    |
| Secure Storage | expo-secure-store                        |
| Testing        | Jest + Testing Library (React Native)    |

---

## Folder Structure

```
mobile/
├── App.tsx                    # Root component — providers setup
├── app.json                   # Expo config
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Loading.tsx
│   │   └── payments/
│   │       ├── PaymentCard.tsx    # Single payment row
│   │       └── PaymentForm.tsx    # Send payment form
│   ├── constants/
│   │   ├── api.ts             # API base URL (dev/prod)
│   │   └── theme.ts           # Colors, spacing, font sizes
│   ├── hooks/
│   │   ├── useAuth.ts         # useLogin, useRegister, useLogout, useTopup
│   │   └── usePayment.ts      # usePayments (infinite), usePayment, useCreatePayment, useUserSearch
│   ├── navigation/
│   │   ├── AppNavigator.tsx   # Root — switches between Auth and Main
│   │   ├── AuthNavigator.tsx  # Stack: Login → Register
│   │   └── MainTabNavigator.tsx # Tabs: Send | History stack | Profile
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── payments/
│   │   │   ├── SendPaymentScreen.tsx
│   │   │   ├── PaymentHistoryScreen.tsx
│   │   │   └── PaymentDetailScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── services/
│   │   ├── api.ts             # Axios instance with JWT interceptor
│   │   ├── auth.ts            # login, register, getProfile, topupBalance
│   │   ├── payment.ts         # createPayment, getPayments, getPaymentById
│   │   └── user.ts            # searchUser (by email)
│   ├── store/
│   │   └── authStore.ts       # Zustand auth state
│   ├── types/
│   │   ├── index.ts           # User, Payment, Currency, PaymentStatus, etc.
│   │   └── navigation.ts      # Navigation param lists
│   └── utils/
│       ├── format.ts          # formatCurrency, formatDate
│       ├── storage.ts         # SecureStore wrappers
│       └── validation.ts      # Zod schemas for all forms
└── __tests__/
    ├── components/
    └── screens/
```

---

## Screens & Navigation

```
AppNavigator
├── AuthNavigator (when logged out)
│   ├── LoginScreen
│   └── RegisterScreen
└── MainTabNavigator (when logged in)
    ├── Tab: Send → SendPaymentScreen
    ├── Tab: History → PaymentsStack
    │   ├── PaymentHistoryScreen (list)
    │   └── PaymentDetailScreen (detail)
    └── Tab: Profile → ProfileScreen
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable                             | Required        | Description                                 |
| ------------------------------------ | --------------- | ------------------------------------------- |
| `EXPO_PUBLIC_API_URL`                | Production only | Backend URL for production builds           |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No              | Stripe publishable key (for future card UI) |

> In development, the API URL is automatically set to `http://localhost:4000` (iOS) or `http://10.0.2.2:4000` (Android). No `.env` file is required for local development.

---

## Installation

**Prerequisites:** Node.js 20+, Expo CLI.

```bash
# From the mobile/ directory
npm install
```

---

## Running Locally

Make sure the backend server is running first (see `server/README.md`), then:

```bash
# From the project root
npm run start:mobile

# Or directly from mobile/
cd mobile && npm start
```

This launches the Expo dev server.

---

## Running on a Device / Simulator

After starting the dev server:

| Target                  | Command / Action                      |
| ----------------------- | ------------------------------------- |
| iOS Simulator           | Press `i` (requires Xcode)            |
| Android Emulator        | Press `a` (requires Android Studio)   |
| iOS Physical Device     | Scan QR code with the **Expo Go** app |
| Android Physical Device | Scan QR code with the **Expo Go** app |

**iOS Simulator setup:**

1. Install Xcode from the App Store
2. Xcode → Settings → Platforms → download an iOS simulator
3. Press `i` in the Expo terminal

**Android Emulator setup:**

1. Install [Android Studio](https://developer.android.com/studio)
2. Virtual Device Manager → Create Device → Start
3. Press `a` in the Expo terminal

---

## Running Tests

```bash
npm test

# Watch mode
npm run test:watch
```

---

## Build & Deployment

To create a production build, use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project (first time only)
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

Set `EXPO_PUBLIC_API_URL` in your EAS environment variables to point to your production backend.

---

## Architecture Decisions

| Decision                              | Rationale                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **TanStack Query for server state**   | Provides caching, background refetch, and infinite scroll out of the box. Avoids manually managing loading/error states. |
| **Zustand for auth state**            | Minimal boilerplate, synchronous reads, and works naturally with TanStack Query.                                         |
| **Axios interceptors for JWT**        | Token is automatically attached to every request; 401 responses auto-clear the stored token.                             |
| **Amounts in cents (integer)**        | Eliminates floating-point rounding errors common in financial apps. Display layer divides by 100.                        |
| **Zod for form validation**           | Shared schema definitions between server and mobile reduce duplication and keep validation logic consistent.             |
| **Nested stack inside tab navigator** | Allows PaymentDetail to be pushed on top of PaymentHistory while keeping the tab bar visible.                            |

---

## Troubleshooting

| Problem                                       | Fix                                                                                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Network request failed`                      | Backend server is not running. Start it with `npm run start:server` from the project root.                                                                  |
| `Expo Go` app shows a QR scan error           | Make sure your phone is on the same Wi-Fi network as your computer.                                                                                         |
| iOS Simulator not opening                     | Run `xcode-select --install` to ensure Xcode command-line tools are installed.                                                                              |
| Android Emulator not connecting               | Use `10.0.2.2` instead of `localhost` — this is the Android emulator's alias for the host machine. This is handled automatically in `src/constants/api.ts`. |
| `Insufficient balance` error when sending     | Go to the Profile tab and tap **+ Add Funds** to top up your balance.                                                                                       |
| Auth token expired                            | Log out and log back in to get a fresh token.                                                                                                               |
| Metro bundler errors after dependency changes | Stop the dev server, run `npm install`, and restart with `npm start -- --clear`.                                                                            |
