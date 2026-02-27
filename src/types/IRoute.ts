import { IRoutePoint } from "./IRoutePoint";

export interface IRoute {
  id: string;
  points: IRoutePoint[];
  color?: string;
  distance?: number;
  time?: number;
}
