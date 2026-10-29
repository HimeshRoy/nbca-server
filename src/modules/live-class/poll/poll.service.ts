import { redis } from "../../../config/redis";

/* ============================================================
   TYPES
============================================================ */

export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export type LiveClassPoll = {
  id: string;
  liveClassId: string;
  question: string;
  options: PollOption[];
  correctOptionId: string;
  isActive: boolean;
  createdAt: number;
  closedAt?: number;
};

/* ============================================================
   REDIS KEYS
============================================================ */

const getPollKey = (liveClassId: string) =>
  `nbca:live-class:${liveClassId}:poll`;

const getPollVotesKey = (liveClassId: string) =>
  `nbca:live-class:${liveClassId}:poll:voters`;

/* ============================================================
   GET ACTIVE POLL
============================================================ */

export const getActivePoll = async (
  liveClassId: string,
) => {
  const key = getPollKey(liveClassId);

  const poll =
    await redis.get<LiveClassPoll>(key);

  if (!poll) {
    return null;
  }

  return poll;
};

/* ============================================================
   CREATE POLL
============================================================ */

export const createPoll = async (
  liveClassId: string,
  question: string,
  optionTexts: string[],
  correctOptionIndex: number,
) => {
  const existingPoll =
    await getActivePoll(liveClassId);

  if (existingPoll?.isActive) {
    throw new Error(
      "There is already an active poll in this classroom.",
    );
  }

  const trimmedQuestion =
    question.trim();

  if (!trimmedQuestion) {
    throw new Error(
      "Poll question is required.",
    );
  }

  if (
    optionTexts.length < 2 ||
    optionTexts.length > 6
  ) {
    throw new Error(
      "A poll must have between 2 and 6 options.",
    );
  }

  const cleanedOptions =
    optionTexts
      .map((option) => option.trim())
      .filter(Boolean);

  if (cleanedOptions.length < 2) {
    throw new Error(
      "At least 2 valid options are required.",
    );
  }

  if (cleanedOptions.length > 6) {
    throw new Error(
      "A poll can have a maximum of 6 options.",
    );
  }

  /* ==========================================================
     CHECK DUPLICATE OPTIONS
  ========================================================== */

  const duplicateOptions =
    new Set(
      cleanedOptions.map((option) =>
        option.toLowerCase(),
      ),
    );

  if (
    duplicateOptions.size !==
    cleanedOptions.length
  ) {
    throw new Error(
      "Poll options must be unique.",
    );
  }

  /* ==========================================================
     VALIDATE CORRECT ANSWER INDEX
  ========================================================== */

  if (
    !Number.isInteger(correctOptionIndex) ||
    correctOptionIndex < 0 ||
    correctOptionIndex >=
      cleanedOptions.length
  ) {
    throw new Error(
      "Please select a valid correct answer.",
    );
  }

  /* ==========================================================
     GENERATE REAL OPTION IDS
  ========================================================== */

  const pollOptionIds =
    cleanedOptions.map(() =>
      crypto.randomUUID(),
    );

  /* ==========================================================
     CONVERT INDEX → REAL OPTION ID
  ========================================================== */

  const correctOptionId =
    pollOptionIds[correctOptionIndex];

  if (!correctOptionId) {
    throw new Error(
      "Failed to determine the correct answer.",
    );
  }

  /* ==========================================================
     CREATE POLL
  ========================================================== */

  const poll: LiveClassPoll = {
    id: crypto.randomUUID(),

    liveClassId,

    question:
      trimmedQuestion,

    options:
      cleanedOptions.map(
        (text, index) => ({
          id:
            pollOptionIds[index],
          text,
          votes: 0,
        }),
      ),

    correctOptionId,

    isActive: true,

    createdAt: Date.now(),
  };

  /* ==========================================================
     SAVE POLL
  ========================================================== */

  await redis.set(
    getPollKey(liveClassId),
    poll,
  );

  /* ==========================================================
     RESET VOTERS
  ========================================================== */

  await redis.del(
    getPollVotesKey(liveClassId),
  );

  /* ==========================================================
     EXPIRATION
  ========================================================== */

  await redis.expire(
    getPollKey(liveClassId),
    60 * 60 * 24,
  );

  await redis.expire(
    getPollVotesKey(liveClassId),
    60 * 60 * 24,
  );

  return poll;
};

/* ============================================================
   VOTE
============================================================ */

export const votePoll = async (
  liveClassId: string,
  studentId: string,
  optionId: string,
) => {
  const poll =
    await getActivePoll(
      liveClassId,
    );

  if (
    !poll ||
    !poll.isActive
  ) {
    throw new Error(
      "There is no active poll.",
    );
  }

  /* ==========================================================
     CHECK IF STUDENT ALREADY VOTED
  ========================================================== */

  const alreadyVoted =
    await redis.sismember(
      getPollVotesKey(
        liveClassId,
      ),
      studentId,
    );

  if (alreadyVoted) {
    throw new Error(
      "You have already voted in this poll.",
    );
  }

  /* ==========================================================
     FIND OPTION
  ========================================================== */

  const option =
    poll.options.find(
      (item) =>
        item.id === optionId,
    );

  if (!option) {
    throw new Error(
      "Invalid poll option.",
    );
  }

  /* ==========================================================
     INCREMENT VOTE
  ========================================================== */

  option.votes += 1;

  /* ==========================================================
     SAVE UPDATED POLL
  ========================================================== */

  await redis.set(
    getPollKey(
      liveClassId,
    ),
    poll,
  );

  /* ==========================================================
     MARK STUDENT AS VOTED
  ========================================================== */

  await redis.sadd(
    getPollVotesKey(
      liveClassId,
    ),
    studentId,
  );

  return poll;
};

/* ============================================================
   CLOSE POLL
============================================================ */

export const closePoll = async (
  liveClassId: string,
) => {
  const poll =
    await getActivePoll(
      liveClassId,
    );

  if (!poll) {
    throw new Error(
      "Poll not found.",
    );
  }

  if (!poll.isActive) {
    return poll;
  }

  const closedPoll: LiveClassPoll = {
    ...poll,

    isActive: false,

    closedAt: Date.now(),
  };

  await redis.set(
    getPollKey(
      liveClassId,
    ),
    closedPoll,
  );

  /*
   * Keep closed results available
   * for the remainder of the classroom.
   */

  await redis.expire(
    getPollKey(
      liveClassId,
    ),
    60 * 60 * 24,
  );

  return closedPoll;
};

/* ============================================================
   CLEAR POLL
============================================================ */

export const clearPoll = async (
  liveClassId: string,
) => {
  await redis.del(
    getPollKey(
      liveClassId,
    ),
  );

  await redis.del(
    getPollVotesKey(
      liveClassId,
    ),
  );
};

/* ============================================================
   CHECK IF STUDENT HAS VOTED
============================================================ */

export const hasStudentVoted = async (
  liveClassId: string,
  studentId: string,
) => {
  return Boolean(
    await redis.sismember(
      getPollVotesKey(
        liveClassId,
      ),
      studentId,
    ),
  );
};