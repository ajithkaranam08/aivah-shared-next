import { apiFetch, ConnectOptions } from "@/connector/client-api";

const validateApi = {
    uuid: (id: string, options?: ConnectOptions) => apiFetch.get(`embed-share/validate/${id}`, options)
}

export default validateApi