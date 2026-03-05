"use client";
import React, { FC, useCallback, useEffect, useRef } from "react";
import styles from "./AddressAction.module.scss";
import AddStart from "../AddStart";
import AdressList from "../AdressList";
import AddAddress from "../AddAdress";
import { useRoute } from "@/context/RouteContext";
import { fromLonLat } from "ol/proj";
import { LineString } from "ol/geom";
import { Feature } from "ol";
import { Stroke, Style } from "ol/style";
import { colorsArray } from "@/types/RouteColor";
import VectorSource from "ol/source/Vector";
import "ol/ol.css";

interface Props {
  children?: React.ReactNode;
  vectorSource: VectorSource;
}

const AddressAction: FC<Props> = ({ vectorSource }) => {
  const { startPoint, destinations, addDestination, setDestinations } =
    useRoute();
  const isFirstRender = useRef(true);
  const isUpdating = useRef(false);

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

  const drawRoute = async (routeData, index: number) => {
    try {
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
              color: colorsArray[index % colorsArray.length],
              width: 4,
            }),
          }),
        );

        vectorSource.addFeature(routeFeature);
      });
    } catch (error) {
      console.error("Error drawing routes:", error);
    }
  };

  useEffect(() => {
    const updateRoutesData = async () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (isUpdating.current || destinations.length === 0) return;

      isUpdating.current = true;

      const updatedDestinations = await Promise.all(
        destinations.map(async (dest) => {
          try {
            const routeData = await fetchRouteFromGeoapify(
              startPoint.coords,
              dest.coords,
            );
            return {
              ...dest,
              distance: routeData.features[0].properties.distance,
              time: routeData.features[0].properties.time,
            };
          } catch (error) {
            console.error(`Ошибка обновления маршрута ${dest.id}:`, error);
            return dest;
          }
        }),
      );

      await setDestinations(updatedDestinations);
      isUpdating.current = false;
    };

    updateRoutesData();
  }, [startPoint]);

  useEffect(() => {
    const redrawRoutes = async () => {
      if (destinations.length === 0) return;

      console.log("🎨 Перерисовка маршрутов, destinations:", destinations);
      vectorSource.clear();

      for (const dest of destinations) {
        try {
          const routeData = await fetchRouteFromGeoapify(
            startPoint.coords,
            dest.coords,
          );
          const index = destinations.findIndex((d) => d.id === dest.id);
          await drawRoute({ destination: dest, route: routeData }, index);
        } catch (error) {
          console.error("Error redrawing route:", error);
        }
      }
    };

    redrawRoutes();
  }, [destinations]);

  const addRoute = async (address: string, coords: [number, number]) => {
    try {
      const routeData = await fetchRouteFromGeoapify(startPoint.coords, coords);
      const newIndex = destinations.length;

      addDestination({
        id: newIndex + 1,
        coords: coords,
        address: address,
        distance: routeData.features[0].properties.distance,
        time: routeData.features[0].properties.time,
        color: colorsArray[newIndex % colorsArray.length],
      });
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    return () => {
      vectorSource.clear();
    };
  }, []);

  return (
    <div className={styles.action}>
      <div className={styles.action__inner}>
        <AddAddress addRoute={addRoute} />
        <AddStart />
      </div>
      <AdressList />
    </div>
  );
};

export default AddressAction;
