import { insurechain_backend } from "../../../declarations/insurechain_backend";
import { catchErrors } from "../utils/error.catcher";

const getInsurances = async (key: string): Promise<InsuranceType[]> => {
  try {
    const insurancesStr = await insurechain_backend.getInsurances();

    const jsonData: InsuranceType[] = JSON.parse(insurancesStr);

    console.log(jsonData);
    return jsonData;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(catchErrors(err));
    }
    throw new Error("Internal server error");
  }
};

export { getInsurances };
