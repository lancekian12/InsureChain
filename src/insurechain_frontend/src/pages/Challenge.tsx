import useSWR from "swr";
import { PageDesciption } from "../components/page.desc";
import { CHALLENGES_DESC } from "../constants/project.desc";
import { getChallenges } from "../fetchers/challenges.fetchers";
import { ChallengesType } from "../interfaces/insurance.interface";

const Challenge = () => {
  const { data, isLoading, error } = useSWR<ChallengesType[]>(
    "/getAvailableChallenges",
    getChallenges
  );
  return (
    <div className="main flex-1 overflow-y-auto flex flex-col gap-8 px-12 py-10">
      <PageDesciption pageName="Challenges" pageDesc={CHALLENGES_DESC.DESC} />
    </div>
  );
};

export default Challenge;
