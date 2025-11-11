export const avatarKeys = {
  getById: (id: number, token: string | null) => ["avatar", id, token],
};

export const conversationKeys = {
  create: (id: string) => ["conversation", id],
  getChats: (conversationId: number) => [
    "conversation",
    conversationId,
    "chats",
  ],
  knowledgeBase: (sessionUUID: string | null) => [
    "knowledge-base",
    sessionUUID,
  ],
};

export const validateKeys = {
  all: ["validate"],
  validateuuid: (id: string, params?: object) => ["uuid", id, params],
};
