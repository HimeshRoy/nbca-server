import {
  AccessToken,
  RoomServiceClient,
} from "livekit-server-sdk";

import { liveKitConfig } from "../../config/livekit";

export const createLiveKitToken = async (
  identity: string,
  roomName: string,
  role: "TEACHER" | "STUDENT",
  name: string,
) => {
  const token = new AccessToken(
    liveKitConfig.apiKey,
    liveKitConfig.apiSecret,
    {
      identity,
      name,
      ttl: "2h",
    },
  );

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

export const removeParticipantFromLiveKit = async (
  roomName: string,
  identity: string,
) => {
  const roomService = new RoomServiceClient(
    liveKitConfig.url,
    liveKitConfig.apiKey,
    liveKitConfig.apiSecret,
  );

  await roomService.removeParticipant(
    roomName,
    identity,
  );
};