interface UserJWT {
  _id: string;
  email: string;
  role: string;
  status: string;
  credits: number;
  iat: number;
  exp: number;
}

interface UserPlan {
  name: string;
  active: boolean;
  dueDate: Date | null;
  startDate: Date | null;
  tier: number;
}