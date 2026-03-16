"use client";
import React, { FC, useState } from "react";
import styles from "./AddStart.module.scss";
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import Button from "@/components/ui/Button";
import { Feature } from "geojson";
import { useRoute } from "@/context/RouteContext";
import { colorsArray } from "@/types/RouteColor";

interface Props {
  children?: React.ReactNode;
}

const AddStart: FC<Props> = () => {
  const [value, setValue] = useState<string>();
  const [addAdressData, setAddAdressData] = useState({
    address: "",
    coords: [0, 0],
  });
  const { setStartPoint, destinations } = useRoute();

  const handlePlaceSelect = (place: Feature | null) => {
    if (!place) return;
    let coords: [number, number];
    console.log(place);
    if (place.geometry?.type === "Point") {
      coords = place.geometry.coordinates as [number, number];
    } else if (place.geometry?.type === "Polygon") {
      const polygonCoords = place.geometry.coordinates[0];

      let sumX = 0;
      let sumY = 0;

      for (const coord of polygonCoords) {
        sumX += coord[0];
        sumY += coord[1];
      }

      coords = [sumX / polygonCoords.length, sumY / polygonCoords.length] as [
        number,
        number,
      ];
    } else {
      try {
        const geometry = place.geometry;

        if (geometry?.type === "LineString") {
          coords = geometry.coordinates[0] as [number, number];
        } else if (geometry?.type === "MultiPoint") {
          coords = geometry.coordinates[0] as [number, number];
        } else if (geometry?.type === "MultiLineString") {
          coords = geometry.coordinates[0][0] as [number, number];
        } else if (geometry?.type === "MultiPolygon") {
          coords = geometry.coordinates[0][0][0] as [number, number];
        } else {
          console.warn("Неподдерживаемый тип геометрии:", geometry?.type);
          return;
        }
      } catch (error) {
        console.error("Ошибка при извлечении координат:", error);
        return;
      }
    }
    const address: string =
      place.properties?.formatted ||
      place.properties?.address_line1 ||
      "Выбранная точка";
    setAddAdressData({ address, coords });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addAdressData.address !== "") {
      setStartPoint({
        id: -1,
        address: addAdressData.address,
        coords: addAdressData.coords as [number, number],
        color: colorsArray[(destinations.length - 1) % colorsArray.length],
      });
      setAddAdressData({ address: "", coords: [0, 0] });
      setValue("");
    }
  };

  return (
    <form className={styles.addAdress} onSubmit={handleSubmit}>
      <span className={styles.addAdress__title}>Указать стартовую точку</span>
      <div className={styles.addAdress__input}>
        <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_API_KEY}>
          <GeoapifyGeocoderAutocomplete
            placeSelect={handlePlaceSelect}
            placeholder="Введите стартовую точку"
            value={value}
            filterByCountryCode={["ru"]}
            lang="ru"
            limit={5}
            addDetails={true}
          />
        </GeoapifyContext>
      </div>
      <Button variant="primary">Изменить</Button>
    </form>
  );
};

export default AddStart;
