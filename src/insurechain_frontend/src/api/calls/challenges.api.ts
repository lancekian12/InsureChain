import { insurechain_backend } from "../../../../declarations/insurechain_backend";
import { UpdateChallengeBody } from "../../interfaces/challenge.interface";
import { catchErrors } from "../../utils/error.catcher";
import { CallbacksInterface } from "./auth.callbacks";

const UpdateChallenge = async (
  data: UpdateChallengeBody,
  { onError, onSuccess, onLoading }: CallbacksInterface
): Promise<void> => {
  try {
    onLoading();

    const res = await insurechain_backend.updateChallenge({
      challengeId: data.challengeId,
      challengeStatus: data.newStatus,
      insuranceId: data.insuranceId,
      userId: data.userId,
      walletAddress: data.walletAddress ?? "",
    });

    if (data.newStatus === "FINISHED") {
      await insurechain_backend.gainToken({ token: res, userId: data.userId });
    }

    onSuccess("Success!");
  } catch (err) {
    if (err instanceof Error) {
      onError(catchErrors(err));
      return;
    }

    return console.log("Uncatched error");
  }
};

export { UpdateChallenge };
