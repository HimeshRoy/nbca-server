"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLiveKitWebhook = void 0;
const livekit_server_sdk_1 = require("livekit-server-sdk");
const livekit_1 = require("../../config/livekit");
const attendance_service_1 = require("../attendance/attendance.service");
const prisma_1 = require("../../config/prisma");
const receiver = new livekit_server_sdk_1.WebhookReceiver(livekit_1.liveKitConfig.apiKey, livekit_1.liveKitConfig.apiSecret);
const handleLiveKitWebhook = async (body, authorization) => {
    const event = await receiver.receive(body, authorization);
    console.log(`[LiveKit Webhook] ${event.event}`);
    /*
     * We only care about participant events
     * for attendance right now.
     */
    if (event.event !== "participant_joined" &&
        event.event !== "participant_left" &&
        event.event !== "participant_connection_aborted") {
        return event;
    }
    const roomName = event.room?.name;
    const identity = event.participant?.identity;
    if (!roomName || !identity) {
        return event;
    }
    /*
     * Our classroom rooms always follow:
     *
     * nbca-live-class-{liveClassId}
     */
    const prefix = "nbca-live-class-";
    if (!roomName.startsWith(prefix)) {
        return event;
    }
    const liveClassId = roomName.slice(prefix.length);
    if (!liveClassId) {
        return event;
    }
    /*
     * Teachers are NOT attendance records.
     *
     * Check whether this identity belongs
     * to a student.
     */
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: identity,
        },
        select: {
            id: true,
        },
    });
    if (!student) {
        return event;
    }
    if (event.event === "participant_joined") {
        await (0, attendance_service_1.markLiveClassJoin)(student.id, liveClassId);
    }
    if (event.event === "participant_left" ||
        event.event === "participant_connection_aborted") {
        await (0, attendance_service_1.markLiveClassLeave)(student.id, liveClassId);
    }
    return event;
};
exports.handleLiveKitWebhook = handleLiveKitWebhook;
