import React, { FC } from "react";
import styles from "./AdressList.module.scss";
import { useRoute } from "@/context/RouteContext";

interface Props {
  children?: React.ReactNode;
}

const AdressList: FC<Props> = () => {
  const { destinations } = useRoute();
  console.log(destinations)
  return <div className={styles.adressList}>{destinations.map(dist => (
    <div key={dist.id} className={styles.adressList__card}>
      <span className={styles['adressList__card--title']}>Маршрут номер: {dist.id}</span>
      <span className={styles['adressList__card--item']}>Адрес: {dist.address}</span>
      <span className={styles['adressList__card--item']}>Расстояние: {dist.distance}</span>
    </div>
  ))}</div>;
};

export default AdressList;
