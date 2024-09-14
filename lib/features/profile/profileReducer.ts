import { UserDetail } from "@/core/actions/user";
import {
  clearUserErros,
  getUserFailure,
  getUserRequest,
  getUserSuccess,
} from "./profileSlice";

const fetchUser = () => async (dispatch: any) => {
  try {
    console.log("Fetching user data...");
    await dispatch(getUserRequest());
    const response = await UserDetail();
    console.log("User data fetched:", response);
    await dispatch(getUserSuccess({ user: response.user }));
    console.log("after get use success");
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    await dispatch(getUserFailure({ message: error.message }));
    await dispatch(clearUserErros());
  }
};

export default fetchUser;
