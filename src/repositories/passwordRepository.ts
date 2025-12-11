import prisma from "../prisma";

export const findUserByResetToken = (token: string) =>
  prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExp: { gt: new Date() },
    },
  });

export const updateUserResetToken = (userId: string, token: string, exp: Date) =>
  prisma.user.update({
    where: { id: userId },
    data: { resetToken: token, resetTokenExp: exp },
  });

export const updateUserPassword = (userId: string, hashedPassword: string) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExp: null,
    },
  });