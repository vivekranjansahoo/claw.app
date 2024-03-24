const prisma = require("../config/prisma-client");
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes')


async function fetchContext(sessionId) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                sessionId
            },
            orderBy: {
                createdAt: "asc"
            },
            select: {
                text: true
            }
        });
        let context = ''
        messages.forEach(({ text }) => {
            context += `${text}\n`;
        });

        return context;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while generating conversation context", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function createGptUser(phoneNumber, mongoId) {
    try {
        const newUser = await prisma.user.create({
            data: {
                phoneNumber,
                mongoId
            }
        });
        return newUser;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while creating new user", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function createModel(name, version) {
    try {
        const newModel = await prisma.model.create({
            data: {
                name,
                version
            }
        });
        return newModel;
    } catch (error) {
        console.log(error)
        throw new AppError("Error while creating new model", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function createSession(userId, initialPrompt, modelName) {
    try {
        const newSession = await prisma.session.create({
            data: {
                userId,
                name: initialPrompt,
                modelName,
            }
        });
        return newSession;

    } catch (error) {
        console.log(error);
        throw new AppError("Error while creating new sesssion", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function createPlan(name, price, token) {
    try {
        const newPlan = await prisma.plan.create({
            data: {
                name,
                price,
                token
            }
        });

        return newPlan;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while creating new plan", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function createMessage(sessionId, prompt, isUser, mongoId) {
    try {
        console.log(sessionId, prompt);
        if (isUser) {
            return await prisma.$transaction(async (tx) => {
                const sender = await tx.user.update({
                    where: {
                        mongoId
                    },
                    data: {
                        tokenUsed: {
                            increment: 1
                        }
                    },
                    include: {
                        plan: { select: { token: true } }
                    }
                });

                if (sender.tokenUsed > sender.plan.token) throw new Error("User does not have enough tokens");

                const newMessage = await prisma.message.create({
                    data: {
                        sessionId,
                        text: prompt,
                        isUser,
                    },
                });
                return { messageId: newMessage.id, message: newMessage.text, token: { used: sender.tokenUsed, total: sender.plan.token } };
            })
        }
        else {
            const newMessage = await prisma.message.create({
                data: {
                    sessionId,
                    text: prompt,
                    isUser,
                }
            })
            return { messageId: newMessage.id, message: newMessage.text };
        }
    } catch (error) {
        console.log(error);
        throw new AppError("Error while creating new message", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function fetchGptUser(mongoId) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                mongoId
            },
            include: {
                plan: {
                    select: {
                        token: true
                    }
                }
            }
        });
        return { createdAt: user.createdAt, phoneNumber: user.phoneNumber, plan: user.planName, token: { used: user.tokenUsed, total: user.plan.token } };
    } catch (error) {
        console.log(error);
        throw new AppError("Error while fetching user", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function fetchSessionBySessionId(sessionId) {
    try {
        const session = await prisma.session.findUnique({
            where: {
                id: sessionId,
            },
            select: {
                modelName: true,
                user: {
                    select: {
                        mongoId: true
                    }
                }
            },
        })
        return session;
    } catch (error) {
        console.log(error);
        throw new AppError("Error fetching session by sessionId", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function fetchSessions(userId, model) {
    try {
        const userSessions = await prisma.session.findMany({
            where: {
                userId,
                modelName: model,
            },
            orderBy: {
                updatedAt: "desc"
            },
            select: {
                name: true,
                updatedAt: true,
                id: true
            }
        });

        return userSessions;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while fetching session", StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function fetchSessionMessages(sessionId) {
    try {
        const sessionMessages = await prisma.session.findUnique({
            where: {
                id: sessionId
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    },
                    select: {
                        id: true,
                        text: true,
                        isUser: true,
                        createdAt: true
                    }
                }
            }
        });

        return sessionMessages;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while fetching session messages", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function createReferralCode(mongoId) {
    try {
        const existingCodeCount = await prisma.referralCode.count({
            where: {
                generatedById: mongoId
            }
        });

        if (existingCodeCount >= 5) throw new Error("Cannot generate more than 5 referral codes");

        const newReferralCode = await prisma.referralCode.create({
            data: {
                generatedById: mongoId,
            }
        });

        return newReferralCode;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while generating new referral code", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function redeemReferralCode(referralCode, redeemedById) {
    try {
        const redeemedReferralCode = await prisma.referralCode.update({
            where: {
                id: referralCode,
                redeemed: false,
            },
            data: {
                redeemedById,
                redeemed: true,
            }
        });

        return redeemedReferralCode;
    } catch (error) {
        console.log(error);
        throw new AppError("Error while redeeming referral code", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createMessage,
    createSession,
    createGptUser,
    createModel,
    createPlan,
    fetchSessions,
    fetchSessionMessages,
    fetchContext,
    fetchGptUser,
    fetchSessionBySessionId,
    createReferralCode,
    redeemReferralCode,
}
