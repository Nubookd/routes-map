import React, { FC } from "react";
import styles from "./AdressList.module.scss";
import { useRoute } from "@/context/RouteContext";

interface Props {
  children?: React.ReactNode;
}

const AdressList: FC<Props> = () => {
  const { destinations } = useRoute();
  return (
    <div className={styles.adressList}>
      {destinations.map((dist) => (
        <div key={dist.id} className={styles.adressList__card}>
          <span
            className={styles["adressList__card--header"]}
            style={{ backgroundColor: dist.color }}
          ></span>
          <div className={styles["adressList__card--inner"]}>
            <span className={styles["adressList__card--title"]}>
              <strong>Маршрут номер: </strong>
              {dist.id}
            </span>
            <span className={styles["adressList__card--item"]}>
              <strong>Адрес: </strong>
              {dist.address}
            </span>
            <span className={styles["adressList__card--item"]}>
              <strong>Расстояние: </strong>
              {dist.distance} м
            </span>
            <span className={styles["adressList__card--item"]}>
              <strong>Время пути: </strong>
              {Math.ceil(Number(dist.time) / 60)} мин
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdressList;
