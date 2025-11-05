import { ConnectOptions, apiFetch } from "@/connector/client-api";
import { ApiResponse } from "@/types/api";
import { ChatbotDetails } from "@/types/validation";

const validateApi = {
  uuid: (id: string, options?: ConnectOptions) =>
    apiFetch.get<ChatbotDetails>(`embed-share/validate/${id}`, options),
};

export default validateApi;
