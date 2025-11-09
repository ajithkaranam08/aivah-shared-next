"use client";
import { useParams } from "next/navigation";

// import Experience from "@/components/experience";
import { useValidateUUID } from "@/services/validate/query";

import ChatCompanionScene from "../_components/chat-companion-scene";

const CompanionEmbedId = () => {
  const { embedId } = useParams();

  const { data } = useValidateUUID(String(embedId), {
    enableScene: 1,
  });

  return (
    <div className="h-full">
      {/* <Experience modelUrl={data.details.avatarUrl} scene="presentation" /> */}
      <ChatCompanionScene sessionData={data} />
    </div>
  );
};

export default CompanionEmbedId;
