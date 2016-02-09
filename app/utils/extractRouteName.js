import { routeMatcher } from 'route-matcher/lib/routematcher';

const ROUTE_NAMES = {
  '/devices': 'devicesList',
  '/devices/new': 'newDevice',
  '/devices/:deviceUuid': 'device',
};

export function extractRouteName(pathname) {
  const matchedRouteUrl = Object.keys(ROUTE_NAMES).find((routeUrl) =>
    routeMatcher(routeUrl).parse(pathname) !== null
  );
  return matchedRouteUrl ? ROUTE_NAMES[matchedRouteUrl] : pathname;
}
