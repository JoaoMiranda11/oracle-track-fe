import { AppDispatch, RootState } from "@/contexts/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getUserCredits } from "@/contexts/redux/user/user.slice";

export function useCredits() {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const { credits } = useSelector((state: RootState) => state.user);

  async function getCredits() {
    setLoading(true);
    await dispatch(getUserCredits());
    setLoading(false);
  }

  return {
    credits: credits.value,
    lastUpdate: credits.lastFetch,
    getCredits,
    loading,
  };
}
