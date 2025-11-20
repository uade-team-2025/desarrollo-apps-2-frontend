import { GRAPHHOPPER_API_KEY, GRAPHHOPPER_URL } from '../../config/api.config';
import { optimizeRouteOrder, type RoutePoint } from '../../utils/routing';

export const getRoute = (
  points: RoutePoint[],
  profile: 'car' | 'bike' | 'foot' = 'car',
  optimizeOrder: boolean = true
) => {
  if (points.length < 2) return '';

  const finalPoints = optimizeOrder ? optimizeRouteOrder(points) : points;

  const invalidPoints = finalPoints.filter(
    (point) =>
      point.lat < -55 || point.lat > -21 || point.lng < -74 || point.lng > -53
  );

  if (invalidPoints.length > 0) {
    console.warn('Puntos fuera del rango de Argentina:', invalidPoints);
  }

  const params = new URLSearchParams({
    key: GRAPHHOPPER_API_KEY,
    profile: profile,
    points_encoded: 'true',
    instructions: 'true',
    locale: 'es',
  });

  finalPoints.forEach((point) => {
    params.append('point', `${point.lat},${point.lng}`);
  });

  return `${GRAPHHOPPER_URL}/api/1/route?${params.toString()}`;
};
