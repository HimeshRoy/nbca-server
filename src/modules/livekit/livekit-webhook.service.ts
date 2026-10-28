import { WebhookReceiver } from "livekit-server-sdk";
import { liveKitConfig } from "../../config/livekit";
import {
  markLiveClassJoin,
  markLiveClassLeave,
} from "../attendance/attendance.service";
import { prisma } from "../../config/prisma";

const receiver = new WebhookReceiver(
  liveKitConfig.apiKey,
  liveKitConfig.apiSecret,
);

export const handleLiveKitWebhook = async (
  body: string,
  authorization: string | undefined,
) => {
  const event = await receiver.receive(body, authorization);

  console.log(`[LiveKit Webhook] ${event.event}`);

  /*
   * We only care about participant events
   * for attendance right now.
   */

  if (
    event.event !== "participant_joined" &&
    event.event !== "participant_left" &&
    event.event !== "participant_connection_aborted"
  ) {
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

  const student = await prisma.student.findUnique({
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
    await markLiveClassJoin(student.id, liveClassId);
  }

  if (
    event.event === "participant_left" ||
    event.event === "participant_connection_aborted"
  ) {
    await markLiveClassLeave(student.id, liveClassId);
  }

  return event;
};
