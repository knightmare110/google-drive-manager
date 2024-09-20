import axios from "axios";
import { BASE_API_URL } from "../utils/constant";

export const listHistory = async (params) => {
	const {page, limit, lastEvaluatedKey} = params;
  try {
    const response = await axios.get(`${BASE_API_URL}history`, {
      params: { page, limit, LastEvaluatedKey: lastEvaluatedKey },
    });
    return {
      success: true,
      response,
    };
  } catch (error) {
    console.log('er', error);
    return {
      success: false,
      error,
    };
  }
};
