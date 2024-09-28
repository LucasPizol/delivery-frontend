import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdate<T, C>(
  fn: (data: Partial<T>) => Promise<C>,
  key: string
) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: fn,
    onSuccess: (variables, data) => {
      queryClient.setQueryData([key], (prevData: C[]) => {
        const mapped = prevData.map((item) => {
          if (typeof item !== "object" || !item) return item;
          if (typeof variables !== "object" || !variables) return item;

          if ("id" in variables && "id" in item) {
            return item.id === variables.id ? { ...item, ...data } : item;
          }

          return item;
        });

        return mapped;
      });
    },
  });

  const update = async (values: Partial<T>) => {
    try {
      await mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };

  return { update, isLoading: isPending };
}
