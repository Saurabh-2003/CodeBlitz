"use server";
import { UserDetail } from "@/core";
import {
  getUserRequest,
  getUserSuccess,
  getUserFailure,
  clearUserErros,
} from "./profileSlice";

export const fetchUser = () => async (dispatch: any) => {
  try {
    dispatch(getUserRequest());
    const response = await UserDetail();
    dispatch(getUserSuccess({ user: response }));
    dispatch(clearUserErros());
  } catch (error) {
    dispatch(getUserFailure({ message: error }));
  }
};
