import { useMutation, useQueryClient } from "@tanstack/react-query";
import { widgetApi } from "../api/widget.api";
import type { CreateWidgetData, UpdateWidgetData, Widget } from "../types/types";

interface SaveWidgetPayload {
  data: UpdateWidgetData;
  isExisting: boolean;
}

export const useSaveWidget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["save-widget"],
    mutationFn: ({ data, isExisting }: SaveWidgetPayload) =>
      // The wizard collects the full widget shape on create; on update the same
      // form is sent but every field is optional. Asserting the create contract
      // here is honest about that: the form always supplies the required fields.
      isExisting
        ? widgetApi.updateWidget(data)
        : widgetApi.createWidget(data as CreateWidgetData),
    onSuccess: (response) => {
      queryClient.setQueryData<Widget>(["widget"], response.data);
    },
  });
};
