"use client";
import { useParams } from "next/navigation";

// import Experience from "@/components/experience";
import { useValidateUUID } from "@/services/validate/query";

import ChatCompanionScene from "../_components/chat-companion-scene";
import { useEffect } from "react";
import { SESSION_TOKEN } from "@/helper/storage";
import Experience from "@/components/experience";

const CompanionEmbedId = () => {
  const { embedId } = useParams();

  const { data, isSuccess } = useValidateUUID(String(embedId), {
    enableScene: 1,
  });



  useEffect(() => {
    const token = SESSION_TOKEN.get();
    if (!token && isSuccess) {
      SESSION_TOKEN.set(data.details.token);
    }
  }, [isSuccess, data]);


  return (
    <div className="h-full relative">
      <section className="absolute top-0 left-0 bg-red-200 size-full z-0">
        <Experience modelUrl={data.details.avatarUrl} scene="presentation" />
      </section>
      <section className="z-10 h-full relative">
        <ChatCompanionScene sessionData={data} />
      </section>
    </div>
  );
};

export default CompanionEmbedId;
