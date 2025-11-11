"use client";
import { useEffect } from "react";

import { useParams } from "next/navigation";

import Experience from "@/components/experience";
import { SESSION_TOKEN } from "@/helper/storage";
import { useAvatarById } from "@/services/avatar/server-query";
// import Experience from "@/components/experience";
import { useValidateUUID } from "@/services/validate/server-query";

import ChatCompanionScene from "../_components/chat-companion-scene";
import { useKnowledgeBase } from "@/services/conversation/server-query";

const CompanionEmbedId = () => {
  const { embedId } = useParams();

  const { data, isSuccess } = useValidateUUID(String(embedId), {
    enableScene: 1,
  });

  const token = SESSION_TOKEN.get();
  const avatar = useAvatarById(data.details.avatarId, data.details.token);
  const avatarInfo = avatar.data?.data;
  const widget = useKnowledgeBase(data.details.uuid, data.details.token);


  useEffect(() => {
    if (!token && isSuccess) {
      SESSION_TOKEN.set(data.details.token);
    }
  }, [isSuccess, data, token]);

  return (
    <div className="relative h-full">
      <section className="absolute top-0 left-0 z-1 size-full">
        <Experience
          modelUrl={avatarInfo?.url}
          color={avatarInfo?.avtarBackground}
          companionType={avatarInfo?.avatarType}
          scene={avatarInfo?.scene}
          widget={widget.data?.content}
        />
      </section>
      <section className="h-full">
        <ChatCompanionScene sessionData={data} />
      </section>
    </div>
  );
};

export default CompanionEmbedId;
