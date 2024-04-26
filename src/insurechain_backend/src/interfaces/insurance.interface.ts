export interface insuranceType {
  insuranceId: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  benefits: benefitsType[];
  challenges: challengesType[];
  createdAt: string;
}

export interface challengesType {
  challengesId: string;
  insuranceId: string;
  name: string;
  description: string;
  tokenPrize: string;
  userStatus: userStatus[];
  createdAt: string;
}

export interface userStatus {
  uid: string;
  status: challengeStatus; // AVAILABLE ON DEFAULT WHEN USER IS NOT PRESENT
  finishedAt?: string;
}

export interface benefitsType {
  name: string;
  description: string;
}

export type challengeStatus = "ON-GOING" | "FINISHED";
