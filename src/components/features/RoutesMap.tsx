"use client";

import { FC, useEffect, useState } from "react";
import { Map, View, TileLayer, VectorLayer } from "react-openlayers";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import MapMarkers from "./MapMarkers";
import VectorSource from "ol/source/Vector";
import { useRoute } from "@/context/RouteContext";
import AddressAction from "./AddressAction";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Circle, Fill, Text, Stroke } from "ol/style";

interface Props {
  children?: React.ReactNode;
}

const RoutesMap: FC<Props> = () => {
  const [vectorSource] = useState(() => new VectorSource());
  const { startPoint, destinations } = useRoute();
  const center = fromLonLat(startPoint.coords);

  useEffect(() => {
    if (!startPoint?.coords) return;

    vectorSource.clear();

    const feature = new Feature({
      geometry: new Point(fromLonLat(startPoint.coords)),
      name: "start-point"
    });

    feature.setStyle(
      new Style({
        image: new Circle({
          radius: 12,
          fill: new Fill({ color: "green" }),
          stroke: new Stroke({ color: "white", width: 2 })
        }),
        text: new Text({
          text: "S",
          fill: new Fill({ color: "white" }),
          font: "bold 14px Arial",
          offsetY: -1
        })
      })
    );

    vectorSource.addFeature(feature);

    return () => {
      vectorSource.clear();
    };
  }, [startPoint, destinations, vectorSource]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map style={{ width: "100%", height: "100%" }}>
        <TileLayer source={new OSM()} />
        <View center={center} zoom={12} />
        <MapMarkers />
        <VectorLayer source={vectorSource} />
      </Map>
      <AddressAction vectorSource={vectorSource} />
    </div>
  );
};

export default RoutesMap;