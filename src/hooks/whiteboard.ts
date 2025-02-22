import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWhiteboard } from "@/lib/actions/whiteboard";

// TODO: break into more granular hooks (ie get name, get data, get description, etc...)

export function useWhiteboard(id: number) {
  return useQuery({
    queryKey: ["whiteboard", id],
    queryFn: () => getWhiteboard(id), // Direct server action call
  });
}

// export function useUpdateWhiteboard() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: updateWhiteboard,  // Direct server action call
//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ['whiteboard', variables.id]
//       })
//     }
//   })
// }
