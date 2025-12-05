import { Request, Response } from "express";
import { messageRepository } from "../repositories/messageRepository";

export const messageController = {
  async sendMessage(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ error: "Missing fields" });
    }

    try {
      const message = await messageRepository.createMessage(userId, receiverId, text);
      return res.status(201).json(message);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  async getMessages(req: Request, res: Response) {
    const { user1Id, user2Id } = req.query;

    if (!user1Id || !user2Id) {
      return res.status(400).json({ error: "Missing user IDs" });
    }

    try {
      const messages = await messageRepository.getMessagesBetweenUsers(
        user1Id as string,
        user2Id as string
      );
      return res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const conversations = await messageRepository.getConversations(userId);
      return res.status(200).json(conversations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
};
