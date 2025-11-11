import { SceneWidget } from "@/components/experience";
import { ConnectOptions, apiFetch } from "@/connector/client-api";

export interface AvatarApiRequest {
  getById: number;
}

export interface AvatarApiResponse {
  getById: {
    data: {
      animation: string;
      animationName: string;
      avatarId: number;
      avatarName: string;
      avatarType: string;
      avtarBackground: string;
      createdDatetime: string;
      id: number;
      scene:
        | "videowall"
        | "empty"
        | "zen"
        | "webresults"
        | "presentation"
        | "presentation2";
      status: 1;
      url: string;
    };
    message: string;
  };
}

const avatarAPi = {
  getById: (id: AvatarApiRequest["getById"], options?: ConnectOptions) =>
    apiFetch.get<AvatarApiResponse["getById"]>(
      `embed-share/avatar/${id}`,
      options
    ),
};

export default avatarAPi;
