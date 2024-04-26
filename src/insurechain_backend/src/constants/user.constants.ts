import { userType } from "../interfaces/user.interface";

export const usersData: userType[] = [
  {
    uid: "olT9lP781LjHLLKS",
    username: "johndoe",
    password:
      "28133fb4c03dec2167610884722e32f81e32ee79f092df75dc785af2513f3fb6.00000000000000000000000000000000",
    email: "johndoe@gmail.com",
    token: "0",
    activities: [
      {
        activity: "CHALLENGES",
        createdAt: "1713372132979",
        event: "DONE",
        activityIds: {
          challengeId: "randomChallengeId12346",
          insuranceId: "ins1",
        },
      },
    ],
    createdAt: "1713372132979",
  },
  {
    uid: "BBn1n32FePsWCRU6",
    username: "janedoe",
    password:
      "28133fb4c03dec2167610884722e32f81e32ee79f092df75dc785af2513f3fb6.00000000000000000000000000000000",
    email: "janedoe@gmail.com",
    token: "0",
    activities: [],
    createdAt: "1713372142964",
  },
];
