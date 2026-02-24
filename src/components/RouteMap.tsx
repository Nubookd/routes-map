"use client";

import { Map, View, TileLayer, VectorLayer } from "react-openlayers";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { LineString } from "ol/geom";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import 'ol/ol.css';

const createRouteSource = (points) => {
  const source = new VectorSource({
    features: [
      new Feature({
        geometry: new LineString(points.map((p) => fromLonLat(p))),
      }),
    ],
  });
  return source;
};

export default function RoutesMap({
  startPoint = [37.85, 55.93],
  destinations = [],
}) {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      {" "}
      {/* 👈 Задаем размеры */}
      <Map style={{ width: "100%", height: "100%" }}>
        <TileLayer source={new OSM()} />
        <View center={fromLonLat(startPoint)} zoom={10} />

        {Array.isArray(destinations) &&
          destinations.map((dest, i) => (
            <VectorLayer
              key={i}
              source={createRouteSource([startPoint, dest])}
              style={{ color: "#3b82f6", width: 5 }}
            />
          ))}
      </Map>
    </div>
  );
}
