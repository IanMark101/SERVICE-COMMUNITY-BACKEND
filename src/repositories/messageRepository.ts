import prisma from "../prisma";
import pusher from "../services/pusherService";

export const messageRepository = {
  async createMessage(senderId: string, receiverId: string, text: string) {
    const message = await prisma.message.create({
      data: { senderId, receiverId, text },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    // Trigger Pusher event for real-time notification
    await pusher.trigger(`messages-${receiverId}`, "new-message", {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      text: message.text,
      createdAt: message.createdAt,
    });

    return message;
  },

  async getMessagesBetweenUsers(user1Id: string, user2Id: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });
  },

  async getConversations(userId: string) {
    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    // Group by conversation partner
    const grouped = new Map();
    conversations.forEach((msg: any) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!grouped.has(partnerId)) {
        grouped.set(partnerId, {
          userId: partnerId,
          userName: partner.name,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
        });
      }
    });

    return Array.from(grouped.values());
  },
};
