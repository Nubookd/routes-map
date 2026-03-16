"use client";

import React, { useState } from "react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/round-borders.css";

import { type Feature } from "geojson";
import styles from "./AddAdress.module.scss";
import Button from "@/components/ui/Button";

interface AddAddressProps {
  placeholder?: string;
  addRoute: (address: string, coords: [number, number]) => Promise<void>;
}

const AddAddress: React.FC<AddAddressProps> = ({
  addRoute,
  placeholder = "Введите адрес...",
}) => {
  const [value, setValue] = useState<string>();
  const [addAdressData, setAddAdressData] = useState({
    address: "",
    coords: [0, 0],
  });

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
      addRoute(addAdressData.address, addAdressData.coords as [number, number]);
      setAddAdressData({ address: "", coords: [0, 0] });
      setValue("");
    }
  };

  return (
    <div className={styles.action}>
      <form className={styles.addAdress} onSubmit={handleSubmit}>
        <span className={styles.addAdress__title}>
          Добавить пункт назначения
        </span>
        <div className={styles.addAdress__input}>
          <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_API_KEY}>
            <GeoapifyGeocoderAutocomplete
              placeSelect={handlePlaceSelect}
              placeholder={placeholder}
              value={value}
              filterByCountryCode={["ru"]}
              lang="ru"
              limit={5}
              addDetails={true}
            />
          </GeoapifyContext>
        </div>
        <Button variant="primary">Добавить</Button>
      </form>
    </div>
  );
};

export default AddAddress;
