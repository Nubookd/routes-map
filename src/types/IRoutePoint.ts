export interface IRoutePoint {
  id: number;
  name?: string;
  coords: [number, number];
  type?: "start" | "waypoint" | "finish";
}
