
export interface GeoapifyRouteResponse {
  type: string;
  features: GeoapifyRouteFeature[];
  bbox?: number[];
  metadata: {
    mode: string;
    waypoints: {
      original_index: number;
      lat: number;
      lon: number;
    }[];
    query: {
      mode: string;
      waypoints: string[];
      alternatives: number;
      details: string[];
    };
    engine: {
      version: string;
      build_date: string;
    };
  };
}

export interface GeoapifyRouteFeature {
  type: "Feature";
  properties: GeoapifyRouteProperties;
  geometry: GeoapifyRouteGeometry;
  bbox?: number[];
}

export interface GeoapifyRouteProperties {
  mode: string;
  waypoints: {
    original_index: number;
    lat: number;
    lon: number;
  }[];
  distance: number; // в метрах
  time: number; // в секундах
  ascent: number;
  descent: number;
  bounds: number[];
  "start-point": string;
  "end-point": string;
  "snapped-start-point"?: string;
  "snapped-end-point"?: string;
}

export type GeoapifyRouteGeometry =
  | { type: "LineString"; coordinates: number[][] }
  | { type: "MultiLineString"; coordinates: number[][][] };

// Тип для данных маршрута с destination
export interface RouteWithDestination {
  destination: { id: number };
  route: GeoapifyRouteResponse;
}
