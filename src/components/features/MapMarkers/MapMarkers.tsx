import React, { FC } from "react";
import styles from "./MapMarkers.module.scss";
import { IRoutePoint } from "@/types";
import { Marker } from "react-openlayers";
import { useRoute } from "@/context/RouteContext";
import { colorsArray } from "@/types/RouteColor";

interface Props {
  children?: React.ReactNode;
}

const CustomMarker = (props: {
  lonLat?: [number, number];
  address?: string;
  color?: string;
  char?: string;
  children?: React.ReactNode;
}) => {
  // @ts-expect-error
  return <Marker {...props} />;
};

const MapMarkers: FC<Props> = () => {
  const { destinations, startPoint } = useRoute();

  return (
    <div>
      {destinations.map((dest: IRoutePoint) => (
        <div key={dest.id}>
          <CustomMarker
            lonLat={dest.coords}
            color={colorsArray[(destinations.length - 1) % colorsArray.length]}
            char={dest.id.toString()}
          />
        </div>
      ))}
    </div>
  );
};

export default MapMarkers;
