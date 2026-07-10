import ConversationModel, { ConversationDocument } from "@/model/Conversation";
import MessageModel from "@/model/Message";
import { WidgetActor } from "@/lib/chat/actor";

async function createConversationForGuest(guestId: string) {
    return ConversationModel.create({
        participantType: "guest",
        participantId: guestId,
        guestId,
        status: "open",
        lastMessage: "",
        lastMessageAt: new Date(),
    });
}

async function createConversationForUser(userId: string, guestId?: string) {
    return ConversationModel.create({
        participantType: "user",
        participantId: userId,
        userId,
        guestId: guestId ?? null,
        status: "open",
        lastMessage: "",
        lastMessageAt: new Date(),
    });
}

async function mergeGuestIntoUserConversation(params: {
    guestConversation: ConversationDocument;
    userConversation: ConversationDocument;
}) {
    const { guestConversation, userConversation } = params;

    await MessageModel.updateMany(
        { conversationId: guestConversation._id },
        { $set: { conversationId: userConversation._id } }
    );

    const shouldUpdateLastMessage =
        new Date(guestConversation.lastMessageAt).getTime() >
        new Date(userConversation.lastMessageAt).getTime();

    if (shouldUpdateLastMessage) {
        userConversation.lastMessage = guestConversation.lastMessage;
        userConversation.lastMessageAt = guestConversation.lastMessageAt;
    }

    if (!userConversation.guestId && guestConversation.guestId) {
        userConversation.guestId = guestConversation.guestId;
    }

    await userConversation.save();
    await ConversationModel.deleteOne({ _id: guestConversation._id });

    return userConversation;
}

export async function getOrCreateConversationForWidgetActor(
    actor: WidgetActor
): Promise<{ conversation: ConversationDocument; created: boolean }> {
    if (actor.kind === "guest") {
        const existing = await ConversationModel.findOne({
            participantType: "guest",
            participantId: actor.participantId,
        });

        if (existing) {
            return { conversation: existing, created: false };
        }

        return {
            conversation: await createConversationForGuest(actor.participantId),
            created: true,
        };
    }

    const [userConversation, guestConversation] = await Promise.all([
        ConversationModel.findOne({
            participantType: "user",
            participantId: actor.participantId,
        }),
        actor.guestId
            ? ConversationModel.findOne({
                  participantType: "guest",
                  participantId: actor.guestId,
              })
            : null,
    ]);

    if (userConversation && guestConversation && String(userConversation._id) !== String(guestConversation._id)) {
        return {
            conversation: await mergeGuestIntoUserConversation({
                guestConversation,
                userConversation,
            }),
            created: false,
        };
    }

    if (userConversation) {
        if (!userConversation.guestId && actor.guestId) {
            userConversation.guestId = actor.guestId;
            await userConversation.save();
        }

        return { conversation: userConversation, created: false };
    }

    if (guestConversation) {
        guestConversation.participantType = "user";
        guestConversation.participantId = actor.participantId;
        guestConversation.userId = actor.participantId;
        guestConversation.guestId = actor.guestId ?? guestConversation.guestId;
        await guestConversation.save();
        return { conversation: guestConversation, created: false };
    }

    return {
        conversation: await createConversationForUser(actor.participantId, actor.guestId),
        created: true,
    };
}

export async function getConversationForWidgetActor(
    actor: WidgetActor
): Promise<ConversationDocument | null> {
    if (actor.kind === "guest") {
        return ConversationModel.findOne({
            participantType: "guest",
            participantId: actor.participantId,
        });
    }

    const [userConversation, guestConversation] = await Promise.all([
        ConversationModel.findOne({
            participantType: "user",
            participantId: actor.participantId,
        }),
        actor.guestId
            ? ConversationModel.findOne({
                  participantType: "guest",
                  participantId: actor.guestId,
              })
            : null,
    ]);

    if (userConversation && guestConversation && String(userConversation._id) !== String(guestConversation._id)) {
        return mergeGuestIntoUserConversation({
            guestConversation,
            userConversation,
        });
    }

    if (userConversation) {
        if (!userConversation.guestId && actor.guestId) {
            userConversation.guestId = actor.guestId;
            await userConversation.save();
        }

        return userConversation;
    }

    if (guestConversation) {
        guestConversation.participantType = "user";
        guestConversation.participantId = actor.participantId;
        guestConversation.userId = actor.participantId;
        guestConversation.guestId = actor.guestId ?? guestConversation.guestId;
        await guestConversation.save();
        return guestConversation;
    }

    return null;
}
