import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

export const useFetch = <T>(
  options: Omit<
    DefinedInitialDataOptions<T | undefined, unknown, T | undefined>,
    "initialData"
  >
) => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    ...options,
    initialData: undefined,
  });

  return {
    data: data as T,
    loading: isLoading || isRefetching,
    error,
    refetch,
  };
};
