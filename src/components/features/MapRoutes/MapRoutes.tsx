import React, { FC, useState } from "react";
import styles from "./MapRoutes.module.scss";
import { IRoutePoint } from "@/types";
import { VectorLayer } from "react-openlayers";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";

interface Props {
  children?: React.ReactNode;
  destinations: IRoutePoint[];
}

const MapRoutes: FC<Props> = ({ children, destinations }) => {
  const [vectorSource] = useState(() => new VectorSource());
  return (
    <div>
      {destinations.map((dest: IRoutePoint) => {
        const coords = fromLonLat(dest.coords);
        return (
          <div key={dest.id}>
            <VectorLayer />
          </div>
        );
      })}
    </div>
  );
};

export default MapRoutes;
