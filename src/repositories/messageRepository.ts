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
};
