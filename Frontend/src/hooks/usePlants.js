import { useQuery } from "@tanstack/react-query";
import { fetchPlantById, fetchPlants } from "../api/plantsApi";

export function useFetchPlants(params) {
  return useQuery({
    queryKey: ["plants", params],
    queryFn: () => fetchPlants(params),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export default function useFetchPlant(id) {
  return useQuery({
    queryKey: ["plant", id],
    queryFn: () => fetchPlantById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
