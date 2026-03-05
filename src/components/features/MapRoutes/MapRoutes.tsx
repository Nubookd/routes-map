import React, { FC, useEffect, useState } from "react";
import { VectorLayer } from "react-openlayers";
import VectorSource from "ol/source/Vector";

interface Props {
  vectorSource: VectorSource;
}

const MapRoutes: FC<Props> = ({ vectorSource }) => {
  return <VectorLayer source={vectorSource} />;
};

export default MapRoutes;