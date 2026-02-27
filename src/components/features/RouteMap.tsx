"use client";

import { FC, useEffect, useState } from "react";
import { Map, View, TileLayer, VectorLayer } from "react-openlayers";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { IRoutePoint } from "@/types";
import MapMarkers from "./MapMarkers";
import VectorSource from "ol/source/Vector";
import { LineString } from "ol/geom";
import { Feature } from "ol";
import { Stroke, Style } from "ol/style";

interface MapProps {
  startPoint?: [number, number];
  destinations: IRoutePoint[];
}

const RoutesMap: FC<MapProps> = ({
  startPoint = [37.851, 55.936],
  destinations,
}) => {
  const center = fromLonLat(startPoint);
  const [vectorSource] = useState(() => new VectorSource());

  const fetchManyCoords = async () => {
    const promises = destinations.map(async (dest) => {
      const url = `https://router.project-osrm.org/route/v1/driving/${startPoint};${dest.coords[0]},${dest.coords[1]}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      return {
        destination: dest,
        route: data,
      };
    });

    const results = await Promise.all(promises);
    return results;
  };

  useEffect(() => {
    vectorSource.clear();
    const post = async () => {
      try {
        const wayColors = ["red", "blue", "green", "orange", "pink"];
        const res = await fetchManyCoords();
        res.map((way, index) => {
          const lineCoords = way.route.routes[0].geometry.coordinates.map(
            (coord: number[]) => {
              return fromLonLat([coord[0], coord[1]]);
            },
          );
          const line = new LineString(lineCoords);

          const routeFeature = new Feature({
            geometry: line,
          });

          routeFeature.setStyle(
            new Style({
              stroke: new Stroke({
                color: wayColors[index],
                width: 3,
              }),
            }),
          );

          vectorSource.addFeature(routeFeature);
        });
      } catch (error) {
        console.log("error: ", error);
      }
    };
    post();
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map style={{ width: "100%", height: "100%" }}>
        <TileLayer source={new OSM()} />
        <View center={center} zoom={12} />
        <MapMarkers destinations={destinations} />
        <VectorLayer source={vectorSource} />
      </Map>
    </div>
  );
};

export default RoutesMap;
