import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGrowEnvs,
  fetchGrowEnvById,
  createGrowEnv,
  deleteGrowEnvById,
} from "../api/growEnvsApi.js";

export const useFetchGrowEnvs = (params) => {
  return useQuery({
    queryKey: ["growEnvs", params],
    queryFn: () => fetchGrowEnvs(params),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useFetchGrowEnvById = (id) => {
  return useQuery({
    queryKey: ["growEnv", id],
    queryFn: () => fetchGrowEnvById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useCreateGrowEnv = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => createGrowEnv(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["growEnvs"]);
    },
  });

  return mutation;
};

export const useDeleteGrowEnvById = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => deleteGrowEnvById(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["growEnvs"]);
    },
  });

  return mutation;
};
export default useCreateGrowEnv;
