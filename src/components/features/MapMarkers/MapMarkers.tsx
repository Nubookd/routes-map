import React, { FC } from "react";
import styles from "./MapMarkers.module.scss";
import { IRoutePoint } from "@/types";
import { Marker } from "react-openlayers";
import { useRoute } from "@/context/RouteContext";
import { colorMap } from "@/types/RouteColor";

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

const MapMarkers: FC<Props> = () => {
  const { destinations } = useRoute();
  console.log(destinations.length)
  return (
    <div>
      {destinations.map((dest: IRoutePoint) => (
        <div key={dest.id}>
          <CustomMarker
            lonLat={dest.coords}
            color={colorMap[destinations.length]}
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
