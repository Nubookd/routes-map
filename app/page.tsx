import RoutesMap from "@/components/features/RouteMap";

export default function Page() {
  return (
    <RoutesMap
      destinations={[
        { id: 1, coords: [37.831, 55.936] },
        { id: 2, coords: [37.871, 55.936] },
        { id: 3, coords: [37.851, 55.916] },
        { id: 4, coords: [37.851, 55.956] },
      ]}
    />
  );
}
