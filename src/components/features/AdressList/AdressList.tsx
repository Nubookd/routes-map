import React, { FC, useEffect, useState } from "react";
import styles from "./AdressList.module.scss";
import { useRoute } from "@/context/RouteContext";
import { IRoutePoint } from "@/types";

interface Props {
  children?: React.ReactNode;
}

const AdressList: FC<Props> = () => {
  const { destinations, startPoint } = useRoute();
  useEffect(() => {
  }, [destinations, startPoint]);

  if (!destinations || destinations.length === 0) {
    return (
      <div className={styles.adressList}>
        <div className={styles.adressList__empty}>
          Нет добавленных маршрутов
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adressList}>
      {destinations.map((dest) => (
        <div key={dest.id} className={styles.adressList__card}>
          <span
            className={styles["adressList__card--header"]}
            style={{ backgroundColor: dest.color }}
          ></span>
          <div className={styles["adressList__card--inner"]}>
            <span className={styles["adressList__card--title"]}>
              <strong>Маршрут номер: </strong>
              {dest.id}
            </span>
            <span className={styles["adressList__card--item"]}>
              <strong>Адрес: </strong>
              {dest.address}
            </span>
            <span className={styles["adressList__card--item"]}>
              <strong>Расстояние: </strong>
              {dest.distance && Math.floor(dest.distance / 1000)}.
              {dest.distance && dest.distance % 1000} км
            </span>
            <span className={styles["adressList__card--item"]}>
              <strong>Время пути: </strong>
              {Math.ceil(Number(dest.time) / 60)} мин
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(AdressList);