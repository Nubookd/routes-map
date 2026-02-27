"use client";

import { FC, useEffect, useState } from "react";
import { Map, View, TileLayer, VectorLayer } from "react-openlayers";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import MapMarkers from "./MapMarkers";
import VectorSource from "ol/source/Vector";
import { LineString } from "ol/geom";
import { Feature } from "ol";
import { Stroke, Style } from "ol/style";
import AddressSearch from "./AddAdress";
import { useRoute } from "@/context/RouteContext";

interface Props {
  children?: React.ReactNode;
}

const RoutesMap: FC<Props> = () => {
  const [vectorSource] = useState(() => new VectorSource());
  const { startPoint, destinations, addDestination } = useRoute();
  const center = fromLonLat(startPoint);

  const fetchRouteFromGeoapify = async (
    start: [number, number],
    end: [number, number],
  ) => {
    const formatCoords = (coords: [number, number]): string => {
      return `${coords[1]},${coords[0]}`;
    };

    const startFormatted = formatCoords(start);
    const endFormatted = formatCoords(end);

    const url =
      `https://api.geoapify.com/v1/routing?` +
      `waypoints=${startFormatted}|${endFormatted}&` +
      `mode=drive&` +
      `apiKey=${process.env.NEXT_PUBLIC_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Geoapify error:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    return data;
  };

  const fetchAllRoutes = async () => {
    const promises = destinations.map(async (dest) => {
      try {
        const routeData = await fetchRouteFromGeoapify(startPoint, dest.coords);
        return {
          destination: dest,
          route: routeData,
        };
      } catch (error) {
        console.error("Error fetching route:", error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((r) => r !== null);
  };

  const addRoute = async (address: string, coords: [number, number]) => {
    try {
      const routeData = await fetchRouteFromGeoapify(startPoint, coords);
      console.log(routeData);
      addDestination({
        id: destinations.length + 1,
        coords: coords,
        address: address,
        distance: routeData.features[0].properties.distance,
        // time: ,
      });
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    const drawRoutes = async () => {
      if (destinations.length === 0) return;

      vectorSource.clear();

      try {
        const wayColors = ["red", "blue", "green", "orange", "pink"];
        const routes = await fetchAllRoutes();
        console.log(routes);
        routes.forEach((routeData, index) => {
          if (!routeData) return;

          const routeGeometry = routeData.route.features[0].geometry;

          let coordinates: number[][][] = [];

          if (routeGeometry.type === "LineString") {
            coordinates = [routeGeometry.coordinates as number[][]];
          } else if (routeGeometry.type === "MultiLineString") {
            coordinates = routeGeometry.coordinates as number[][][];
          } else {
            console.warn("Неизвестный тип геометрии:", routeGeometry.type);
            return;
          }

          coordinates.forEach((lineCoords) => {
            const transformedCoords = lineCoords.map((coord) =>
              fromLonLat([coord[0], coord[1]]),
            );

            const line = new LineString(transformedCoords);
            const routeFeature = new Feature({ geometry: line });

            routeFeature.setStyle(
              new Style({
                stroke: new Stroke({
                  color: wayColors[index % wayColors.length],
                  width: 4,
                }),
              }),
            );

            vectorSource.addFeature(routeFeature);
          });
        });
        console.log(destinations);
      } catch (error) {
        console.error("Error drawing routes:", error);
      }
    };

    drawRoutes();
  }, [destinations]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map style={{ width: "100%", height: "100%" }}>
        <TileLayer source={new OSM()} />
        <View center={center} zoom={12} />
        <MapMarkers />
        <VectorLayer source={vectorSource} />
      </Map>
      <AddressSearch addRoute={addRoute} placeholder="Поиск адреса или места" />
    </div>
  );
};

export default RoutesMap;
