import { ConnectOptions, apiFetch } from "@/connector/client-api";
import { ChatbotDetails } from "@/types/validation";

const validateApi = {
  uuid: (id: string, params?: object, options?: ConnectOptions) => {
    const queryParams = new URLSearchParams();


    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });
    return apiFetch.get<ChatbotDetails>(
      `embed-share/validate/${id}?${queryParams}`,
      options
    );
  },
};

export default validateApi;
