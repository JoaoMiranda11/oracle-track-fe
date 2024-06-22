import { AppDispatch, RootState } from "@/contexts/redux/store";
import { getUserPlanInfo } from "@/contexts/redux/user/user.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./auth.hook";

export function usePlan() {
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const plan = useSelector((state: RootState) => state.user.plan);
  const [loading, setLoading] = useState<boolean>(true);

  async function getPlan() {
    setLoading(true);
    await dispatch(getUserPlanInfo());
    setLoading(false);
  }

  useEffect(() => {
    if (isAuthenticated && plan?.lastFetch === null) {
      getPlan();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, plan]);

  return { getPlan, plan, loading };
}
