/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `` | `/` | `/(auth)` | `/(tabs)` | `/_sitemap` | `/bookmark` | `/create` | `/home` | `/profile` | `/sign-in` | `/sign-up`;
      DynamicRoutes: `/search/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/search/[query]`;
    }
  }
}
