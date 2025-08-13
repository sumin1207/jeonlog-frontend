/* eslint-disable */
import * as Router from "expo-router";

export * from "expo-router";

declare module "expo-router" {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/modal`; params?: Router.UnknownInputParams }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/ExhibitionLogCard`
              | `/exhibition-log/ExhibitionLogCard`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/exhibitionLog`
              | `/exhibition-log/exhibitionLog`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/../contexts/LikeContext`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/like/countLike`
              | `/exhibition-log/like/countLike`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/like/LikeButton`
              | `/exhibition-log/like/LikeButton`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(tabs)"}/category` | `/category`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/exhibitionLog` | `/exhibitionLog`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/home` | `/home`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/search` | `/search`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/mypage` | `/mypage`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/Bookmarked`
              | `/mypage/exhibition/Bookmarked`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/DeleteRecordButton`
              | `/mypage/exhibition/DeleteRecordButton`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/thumbs-up`
              | `/mypage/exhibition/thumbs-up`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/visited`
              | `/mypage/exhibition/visited`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/WriteRecordButton`
              | `/mypage/exhibition/WriteRecordButton`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/exhibition/write-record`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/oauth2/redirect`; params?: Router.UnknownInputParams }
        | {
            pathname: `/onboarding/category`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/onboarding/interest`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/+not-found`; params: Router.UnknownInputParams & {} }
        | {
            pathname: `${"/(tabs)"}/category/[type]` | `/category/[type]`;
            params: Router.UnknownInputParams & { type: string | number };
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/[exhibitionLog-id]`
              | `/exhibition-log/[exhibitionLog-id]`;
            params: Router.UnknownInputParams & {
              "exhibitionLog-id": string | number;
            };
          }
        | {
            pathname: `${"/(tabs)"}/museum/[name]` | `/museum/[name]`;
            params: Router.UnknownInputParams & { name: string | number };
          }
        | {
            pathname: `/exhibition/[id]`;
            params: Router.UnknownInputParams & { id: string | number };
          };
      hrefOutputParams:
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/`; params?: Router.UnknownOutputParams }
        | { pathname: `/modal`; params?: Router.UnknownOutputParams }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/ExhibitionLogCard`
              | `/exhibition-log/ExhibitionLogCard`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/exhibitionLog`
              | `/exhibition-log/exhibitionLog`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `/../contexts/LikeContext`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/like/countLike`
              | `/exhibition-log/like/countLike`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/like/LikeButton`
              | `/exhibition-log/like/LikeButton`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
        | {
            pathname: `${"/(tabs)"}/category` | `/category`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/exhibitionLog` | `/exhibitionLog`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/home` | `/home`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/search` | `/search`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/mypage` | `/mypage`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/Bookmarked`
              | `/mypage/exhibition/Bookmarked`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/DeleteRecordButton`
              | `/mypage/exhibition/DeleteRecordButton`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/thumbs-up`
              | `/mypage/exhibition/thumbs-up`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/visited`
              | `/mypage/exhibition/visited`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/WriteRecordButton`
              | `/mypage/exhibition/WriteRecordButton`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `/exhibition/write-record`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/oauth2/redirect`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/onboarding/category`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `/onboarding/interest`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/+not-found`; params: Router.UnknownOutputParams & {} }
        | {
            pathname: `${"/(tabs)"}/category/[type]` | `/category/[type]`;
            params: Router.UnknownOutputParams & { type: string };
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/[exhibitionLog-id]`
              | `/exhibition-log/[exhibitionLog-id]`;
            params: Router.UnknownOutputParams & { "exhibitionLog-id": string };
          }
        | {
            pathname: `${"/(tabs)"}/museum/[name]` | `/museum/[name]`;
            params: Router.UnknownOutputParams & { name: string };
          }
        | {
            pathname: `/exhibition/[id]`;
            params: Router.UnknownOutputParams & { id: string };
          };
      href:
        | Router.RelativePathString
        | Router.ExternalPathString
        | `/${`?${string}` | `#${string}` | ""}`
        | `/modal${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/exhibition-log/ExhibitionLogCard${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/exhibition-log/ExhibitionLogCard${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/exhibition-log/exhibitionLog${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/exhibition-log/exhibitionLog${`?${string}` | `#${string}` | ""}`
        | `/../contexts/LikeContext${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/exhibition-log/like/countLike${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/exhibition-log/like/countLike${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/exhibition-log/like/LikeButton${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/exhibition-log/like/LikeButton${`?${string}` | `#${string}` | ""}`
        | `/_sitemap${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/category${`?${string}` | `#${string}` | ""}`
        | `/category${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/exhibitionLog${`?${string}` | `#${string}` | ""}`
        | `/exhibitionLog${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/home${`?${string}` | `#${string}` | ""}`
        | `/home${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/search${`?${string}` | `#${string}` | ""}`
        | `/search${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/mypage${`?${string}` | `#${string}` | ""}`
        | `/mypage${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/mypage/exhibition/Bookmarked${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/mypage/exhibition/Bookmarked${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/mypage/exhibition/DeleteRecordButton${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/mypage/exhibition/DeleteRecordButton${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `${"/(tabs)"}/mypage/exhibition/thumbs-up${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/mypage/exhibition/thumbs-up${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/mypage/exhibition/visited${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/mypage/exhibition/visited${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/mypage/exhibition/WriteRecordButton${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/mypage/exhibition/WriteRecordButton${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/exhibition/write-record${`?${string}` | `#${string}` | ""}`
        | `/oauth2/redirect${`?${string}` | `#${string}` | ""}`
        | `/onboarding/category${`?${string}` | `#${string}` | ""}`
        | `/onboarding/interest${`?${string}` | `#${string}` | ""}`
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/modal`; params?: Router.UnknownInputParams }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/ExhibitionLogCard`
              | `/exhibition-log/ExhibitionLogCard`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/exhibitionLog`
              | `/exhibition-log/exhibitionLog`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/../contexts/LikeContext`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/like/countLike`
              | `/exhibition-log/like/countLike`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/like/LikeButton`
              | `/exhibition-log/like/LikeButton`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(tabs)"}/category` | `/category`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/exhibitionLog` | `/exhibitionLog`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/home` | `/home`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/search` | `/search`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/mypage` | `/mypage`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/Bookmarked`
              | `/mypage/exhibition/Bookmarked`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/DeleteRecordButton`
              | `/mypage/exhibition/DeleteRecordButton`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/thumbs-up`
              | `/mypage/exhibition/thumbs-up`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/visited`
              | `/mypage/exhibition/visited`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${"/(tabs)"}/mypage/exhibition/WriteRecordButton`
              | `/mypage/exhibition/WriteRecordButton`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/exhibition/write-record`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/oauth2/redirect`; params?: Router.UnknownInputParams }
        | {
            pathname: `/onboarding/category`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/onboarding/interest`;
            params?: Router.UnknownInputParams;
          }
        | `/+not-found${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/category/${Router.SingleRoutePart<T>}${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/category/${Router.SingleRoutePart<T>}${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `${"/(tabs)"}/exhibition-log/${Router.SingleRoutePart<T>}${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/exhibition-log/${Router.SingleRoutePart<T>}${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `${"/(tabs)"}/museum/${Router.SingleRoutePart<T>}${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/museum/${Router.SingleRoutePart<T>}${
            | `?${string}`
            | `#${string}`
            | ""}`
        | `/exhibition/${Router.SingleRoutePart<T>}${
            | `?${string}`
            | `#${string}`
            | ""}`
        | { pathname: `/+not-found`; params: Router.UnknownInputParams & {} }
        | {
            pathname: `${"/(tabs)"}/category/[type]` | `/category/[type]`;
            params: Router.UnknownInputParams & { type: string | number };
          }
        | {
            pathname:
              | `${"/(tabs)"}/exhibition-log/[exhibitionLog-id]`
              | `/exhibition-log/[exhibitionLog-id]`;
            params: Router.UnknownInputParams & {
              "exhibitionLog-id": string | number;
            };
          }
        | {
            pathname: `${"/(tabs)"}/museum/[name]` | `/museum/[name]`;
            params: Router.UnknownInputParams & { name: string | number };
          }
        | {
            pathname: `/exhibition/[id]`;
            params: Router.UnknownInputParams & { id: string | number };
          };
    }
  }
}
