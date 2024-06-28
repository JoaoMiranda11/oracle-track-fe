interface UserJWT {
  _id: string;
  email: string;
  role: string;
  status: string;
  iat: number;
  exp: number;
}

interface UserPlan {
  name: string;
  active: boolean;
  dueDate: string | null;
  startDate: string | null;
  tier: number;
}