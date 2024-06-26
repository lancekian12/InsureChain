import { Canister, update, text, Void, query } from "azle";
import { hashPassword } from "./utils/bycrypt";
import { validate, validateLogin } from "./utils/user.validation";
import { generateUID } from "./utils/uid.generator";
import { userType } from "./interfaces/user.interface";
import { addTokenToUser } from "./repositories/token.persistence";
import { insuranceType } from "./interfaces/insurance.interface";
import {
  applyInsurance,
  createInsurance,
  getInsurance,
} from "./repositories/insurance.persistence";
import {
  gainTokenBody,
  signInBody,
  signInResponse,
  signUpBody,
  userBody,
} from "./records/user.records";
import {
  challengeBody,
  createChallengeBody,
  updateChallengeBody,
  getAvailableChallengesBody,
  getInsuranceChallengesBody,
} from "./records/challenge.records";
import {
  applyInsuranceBody,
  createInsuranceBody,
  insuranceBody,
} from "./records/insurance.records";
import { usersData } from "./constants/user.constants";
import insuranceData from "./constants/insurance.constants";
import { getUser, profileData } from "./repositories/user.persistance";
import {
  createChallenge,
  getAvailableChallenges,
  getChallenge,
  getChallengesFromInsurance,
  updateChallengeStatus,
} from "./repositories/challenges.persistence";

let usersDb: userType[] = usersData;
let insuranceDb: insuranceType[] = insuranceData;

export default Canister({
  signUp: update([signUpBody], Void, async (req) => {
    try {
      await validate(req.username, req.email, req.password, usersDb);

      const type = req.isInsuranceCompany.trim().toLowerCase();

      const isInsuranceCompany = type === "yes" || type === "true";

      const res: userType = {
        uid: generateUID(),
        username: req.username,
        password: await hashPassword(req.password),
        email: req.email,
        token: "0",
        isInsuranceCompany: isInsuranceCompany ? "YES" : "NO",
        createdAt: Date.now().toString(),
        activities: [],
      };

      usersDb.push(res);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }

      throw new Error("Invalid inputs please check them!");
    }
  }),

  signIn: update([signInBody], signInResponse, async (req) => {
    try {
      const res = await validateLogin(req.username, req.password, usersDb);

      return {
        isInsuranceCompany: res.isInsuranceCompany,
        uid: res.uid,
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }

      throw new Error("Internal server error");
    }
  }),

  updateChallenge: update([updateChallengeBody], text, async (req) => {
    try {
      const tokenPrize = await updateChallengeStatus(
        req.userId,
        req.insuranceId,
        req.challengeId,
        req.challengeStatus,
        insuranceDb,
        usersDb,
        req.walletAddress
      );

      return tokenPrize;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }

      throw new Error("Internal server error!");
    }
  }),

  createInsurance: update([createInsuranceBody], Void, async (req) => {
    try {
      await createInsurance(
        req.insuranceName,
        req.description,
        req.longDescription,
        [],
        insuranceDb,
        req.requiredTokens,
        req.userId,
        usersDb,
        req.imageUrl
      );
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }

      throw new Error("Internal server error!");
    }
  }),

  createChallenge: update([createChallengeBody], Void, async (req) => {
    try {
      await createChallenge(
        req.insuranceId,
        req.name,
        req.description,
        req.challenge,
        req.tokenPrize,
        insuranceDb
      );
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }

      throw new Error("Internal server error!");
    }
  }),

  gainToken: update([gainTokenBody], Void, async (req) => {
    try {
      addTokenToUser(req.userId, req.token, usersDb);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }

      throw new Error("Internal server error!");
    }
  }),

  getAllUsers: query([], text, () => {
    const users = JSON.stringify(usersDb);
    return users;
  }),

  getInsurances: query([], text, () => {
    return JSON.stringify(insuranceDb);
  }),

  getUser: query([userBody], text, async (req) => {
    try {
      const user = await getUser(req.userId, usersDb);

      return JSON.stringify(user);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Internal server error!");
    }
  }),

  getUserProfileData: query([userBody], text, async (req) => {
    try {
      const data = await profileData(req.userId, usersDb, insuranceDb);

      return JSON.stringify(data);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Internal server error!");
    }
  }),

  getInsurance: query([insuranceBody], text, async (req) => {
    try {
      const insuranceObj = await getInsurance(req.insuranceId, insuranceDb);

      return JSON.stringify(insuranceObj);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Internal server error!");
    }
  }),

  getChallenge: query([challengeBody], text, async (req) => {
    try {
      const challenge = await getChallenge(
        req.insuranceId,
        insuranceDb,
        req.challengeId
      );
      return JSON.stringify(challenge);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Internal server error!");
    }
  }),

  getInsuranceChallenges: query([getInsuranceChallengesBody], text, (req) => {
    const challenges = getChallengesFromInsurance(req.insuranceId, insuranceDb);

    return JSON.stringify(challenges);
  }),

  getAvailableChallenges: query(
    [getAvailableChallengesBody],
    text,
    async (req) => {
      try {
        const availableChallenges = await getAvailableChallenges(
          req.userId,
          insuranceDb
        );
        return JSON.stringify(availableChallenges);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
        throw new Error("Internal server error!");
      }
    }
  ),

  applyInsurance: update([applyInsuranceBody], Void, async (req) => {
    try {
      await applyInsurance(
        req.userId,
        req.tokenBalance,
        req.insuranceId,
        insuranceDb,
        usersDb
      );
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Internal server error!");
    }
  }),
});
