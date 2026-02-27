export interface IRoutePoint {
  id: number;
  address?: string;
  coords: [number, number];
  type?: "start" | "waypoint" | "finish";
  distance?: number;
  time?: number;
}
