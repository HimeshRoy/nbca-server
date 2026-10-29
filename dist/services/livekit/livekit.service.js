"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeParticipantFromLiveKit = exports.createLiveKitToken = void 0;
const livekit_server_sdk_1 = require("livekit-server-sdk");
const livekit_1 = require("../../config/livekit");
const createLiveKitToken = async (identity, roomName, role, name) => {
    const token = new livekit_server_sdk_1.AccessToken(livekit_1.liveKitConfig.apiKey, livekit_1.liveKitConfig.apiSecret, {
        identity,
        name,
        ttl: "2h",
    });
    if (role === "TEACHER") {
        token.addGrant({
            roomJoin: true,
            room: roomName,
            // Teacher can publish media
            canPublish: true,
            // Teacher can receive everyone
            canSubscribe: true,
            // Teacher can send chat / classroom events
            canPublishData: true,
        });
    }
    if (role === "STUDENT") {
        token.addGrant({
            roomJoin: true,
            room: roomName,
            // Student CANNOT publish camera/microphone/screen
            canPublish: false,
            // Student CAN watch everyone
            canSubscribe: true,
            // Student CAN send chat / raise-hand events
            canPublishData: true,
        });
    }
    return token.toJwt();
};
exports.createLiveKitToken = createLiveKitToken;
const removeParticipantFromLiveKit = async (roomName, identity) => {
    const roomService = new livekit_server_sdk_1.RoomServiceClient(livekit_1.liveKitConfig.url, livekit_1.liveKitConfig.apiKey, livekit_1.liveKitConfig.apiSecret);
    await roomService.removeParticipant(roomName, identity);
};
exports.removeParticipantFromLiveKit = removeParticipantFromLiveKit;
