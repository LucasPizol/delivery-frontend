import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useInsert<T, C>(fn: (data: T) => Promise<C>, key: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: fn,
    onSuccess: (content) => {
      queryClient.setQueryData([key], (data: any) => {
        console.log({ content, data });

        return [...data, content];
      });
    },
  });

  const succeed = async (values: T) => {
    try {
      await mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };

  return { succeed, isLoading: isPending };
}
