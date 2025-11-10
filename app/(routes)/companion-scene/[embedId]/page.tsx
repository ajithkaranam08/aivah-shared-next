"use client";
import { useParams } from "next/navigation";

// import Experience from "@/components/experience";
import { useValidateUUID } from "@/services/validate/query";

import ChatCompanionScene from "../_components/chat-companion-scene";
import { useEffect } from "react";
import { SESSION_TOKEN } from "@/helper/storage";
import Experience from "@/components/experience";
import { useKnowledgeBase } from "@/services/conversation/query";

const CompanionEmbedId = () => {
  const { embedId } = useParams();

  const { data, isSuccess } = useValidateUUID(String(embedId), {
    enableScene: 1,
  });

  const token = SESSION_TOKEN.get();



  useEffect(() => {

    if (!token && isSuccess) {
      SESSION_TOKEN.set(data.details.token);
    }
  }, [isSuccess, data]);

  const widget = useKnowledgeBase({ enabled: !!token })




  return (
    <div className="h-full relative">
      <section className="absolute top-0 left-0  size-full z-1">
        <Experience modelUrl={data.details.avatarUrl} scene="presentation" widget={widget.data?.content} />
      </section>
      <section className=" h-full">
        <ChatCompanionScene sessionData={data} />
      </section>
    </div>
  );
};

export default CompanionEmbedId;
