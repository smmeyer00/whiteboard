import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWhiteboard, updateWhiteboard } from "@/lib/actions/whiteboard";
import { Prisma } from "@prisma/client";

// TODO: break into more granular hooks (ie get name, get data, get description, etc...)

export function useWhiteboardQuery(id: number) {
  return useQuery({
    queryKey: ["whiteboard", id],
    queryFn: () => getWhiteboard(id), // Direct server action call
  });
}

export function useUpdateWhiteboardMutation(
  optimisticCacheUpdate: boolean = true,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Prisma.WhiteboardUpdateInput;
    }) => updateWhiteboard(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing fetches
      await queryClient.cancelQueries({ queryKey: ["whiteboard", id] });

      // Get current data
      const previousData = queryClient.getQueryData(["whiteboard", id]);

      if (optimisticCacheUpdate) {
        // Optimistically update the cache
        queryClient.setQueryData(
          ["whiteboard", id],
          (old: Prisma.WhiteboardUpdateInput | undefined) => ({
            ...old,
            ...data,
          }),
        );
      }

      // Return context with previous data
      return { previousData };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      queryClient.setQueryData(["whiteboard", id], context?.previousData);
    },
    onSettled: (_, __, { id }) => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["whiteboard", id] });
    },
  });
}
