import { ApiResponse } from "@/@type/response";
import { ChatbotDetails } from "@/@type/validation";
import { apiFetch, ConnectOptions } from "@/connector/client-api";

const validateApi = {
    uuid: (id: string, options?: ConnectOptions) => apiFetch.get<ChatbotDetails>(`embed-share/validate/${id}`, options)
}

export default validateApi