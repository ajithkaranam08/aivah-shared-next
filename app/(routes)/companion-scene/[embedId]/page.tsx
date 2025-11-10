"use client";
import { useParams } from "next/navigation";

// import Experience from "@/components/experience";
import { useValidateUUID } from "@/services/validate/query";

import ChatCompanionScene from "../_components/chat-companion-scene";
import { useEffect } from "react";
import { SESSION_TOKEN } from "@/helper/storage";

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
    <div className="h-full">
      {/* <Experience modelUrl={data.details.avatarUrl} scene="presentation" /> */}
      <ChatCompanionScene sessionData={data} />
    </div>
  );
};

export default CompanionEmbedId;
