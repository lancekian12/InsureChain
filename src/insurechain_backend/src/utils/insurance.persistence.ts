import { challengesType, insuranceType } from "../types/insurance.types";
import { generateUID } from "./uid.generator";

const updateChallengeStatus = async (
  userId: string,
  insuranceId: string,
  challengesId: string,
  insuranceDb: insuranceType[]
): Promise<string> => {
  try {
    if (!userId || !insuranceId || !challengesId) {
      throw new Error(
        "Invalid parameters. userId, insuranceId, and challengesId must be provided."
      );
    }

    if (insuranceDb.length === 0) {
      throw new Error("Insurance database is empty.");
    }

    const insurance = insuranceDb.find(
      (insurance) => insurance.insuranceId === insuranceId
    );

    if (!insurance) {
      throw new Error(`Insurance with ID '${insuranceId}' not found.`);
    }

    const challenge = insurance.challenges.find(
      (challenge) => challenge.challengesId === challengesId
    );

    if (!challenge) {
      throw new Error(
        `Challenge with ID '${challengesId}' not found in insurance '${insuranceId}'.`
      );
    }

    console.log(
      `Challenge '${challenge.name}' completed for user '${userId}' in insurance '${insurance.name}'.`
    );

    if (!challenge.claimedUsers.includes(userId)) {
      challenge.claimedUsers.push(userId);
    }

    return challenge.tokenPrize;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Internal server error!");
  }
};

const createInsurance = async (
  insuranceName: string,
  description: string,
  image: string,
  challenges: challengesType[],
  insuranceDb: insuranceType[]
): Promise<void> => {
  try {
    if (
      !insuranceName ||
      !description ||
      !image ||
      !challenges ||
      challenges.length === 0
    ) {
      throw new Error(
        "Invalid parameters. insuranceName, description, image, and challenges must be provided."
      );
    }

    const insuranceId = generateUID();
    const insurance: insuranceType = {
      insuranceId,
      name: insuranceName,
      description,
      image,
      challenges: challenges.map((challenge) => ({
        ...challenge,
        challengesId: generateUID(),
        claimedUsers: [],
      })),
    };

    insuranceDb.push(insurance);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Internal server error!");
  }
};

const createChallenge = async (
  insuranceId: string,
  name: string,
  description: string,
  challenge: string,
  tokenPrize: string,
  insuranceDb: insuranceType[]
): Promise<void> => {
  try {
    if (!insuranceId || !name || !description || !challenge || !tokenPrize) {
      throw new Error(
        "Invalid parameters. insuranceId, name, description, challenge, and tokenPrize must be provided."
      );
    }

    const insurance = insuranceDb.find(
      (insurance) => insurance.insuranceId === insuranceId
    );
    if (!insurance) {
      throw new Error(`Insurance with ID '${insuranceId}' not found.`);
    }

    const challengeId = generateUID();
    const newChallenge: challengesType = {
      challengesId: challengeId,
      name,
      description,
      challenge,
      tokenPrize,
      claimedUsers: [],
    };

    insurance.challenges.push(newChallenge);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Internal server error!");
  }
};

export { updateChallengeStatus, createInsurance, createChallenge };
