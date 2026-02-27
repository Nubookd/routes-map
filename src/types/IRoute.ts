import { IRoutePoint } from "./IRoutePoint";

export interface IRoute {
  id: string;
  name?: string;
  points: IRoutePoint[];
  color?: string;
}
