import { AppDispatch, RootState } from "@/contexts/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getUserCredits } from "@/contexts/redux/user/user.slice";

export function useCredits() {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const fetchingRef = useRef(false);
  const { credits, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  async function getCredits() {
    setLoading(true);
    fetchingRef.current = true;
    await dispatch(getUserCredits());
    fetchingRef.current = false;
    setLoading(false);
  }

  useEffect(() => {
    if (credits.lastFetch === null && !fetchingRef.current && isAuthenticated) {
      getCredits();
    }
  }, [credits.lastFetch, loading, isAuthenticated]);

  return {
    credits: credits.value ?? 0,
    lastUpdate: credits.lastFetch,
    getCredits,
    loading,
  };
}
