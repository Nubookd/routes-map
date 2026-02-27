"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Feature } from "geojson";
import { IRoute, IRoutePoint } from "@/types";

interface RouteContextType {
  // Состояния
  startPoint: [number, number];
  destinations: IRoutePoint[];
  selectedRoute: Feature | null;
  isLoading: boolean;
  error: string | null;

  // Методы
  setStartPoint: (point: [number, number]) => void;
  addDestination: (point: IRoutePoint) => void;
  removeDestination: (id: number) => void;
  clearDestinations: () => void;
  setSelectedRoute: (route: Feature | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startPoint, setStartPoint] = useState<[number, number]>([
    37.851, 55.936,
  ]);
  const [destinations, setDestinations] = useState<IRoutePoint[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Feature | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDestination = (point: IRoutePoint) => {
    setDestinations((prev) => [
      ...prev,
      { ...point, id: destinations.length + 1 },
    ]);
  };


  const removeDestination = (id: number) => {
    setDestinations((prev) => prev.filter((dest) => dest.id !== id));
  };

  const clearDestinations = () => {
    setDestinations([]);
  };

  const value: RouteContextType = {
    startPoint,
    destinations,
    selectedRoute,
    isLoading,
    error,
    setStartPoint,
    addDestination,
    removeDestination,
    clearDestinations,
    setSelectedRoute,
    setLoading: setIsLoading,
    setError,
  };

  return (
    <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};
