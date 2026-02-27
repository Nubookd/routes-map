import React, { FC } from "react";
import styles from "./MapMarkers.module.scss";
import { IRoutePoint } from "@/types";
import { Marker } from "react-openlayers";
import { useRoute } from "@/context/RouteContext";

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
  return <Marker {...props} />;
};
const AVAILABLE_COLORS = ["red", "blue", "green", "orange", "pink"];

const MapMarkers: FC<Props> = () => {
  const { destinations } = useRoute();
  return (
    <div>
      {destinations.map((dest: IRoutePoint) => (
        <div key={dest.id}>
          <CustomMarker
            lonLat={dest.coords}
            color={AVAILABLE_COLORS[dest.id - 1]}
            char={dest.id.toString()}
          />
        </div>
      ))}
      <CustomMarker
        lonLat={[37.851031, 55.936505]}
        color="green"
        char={"base"}
      />
    </div>
  );
};

export default MapMarkers;
