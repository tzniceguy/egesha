import { z } from "zod";

const User = z.object({
  phoneNumber: z.string(),
  firstName: z.string().min(2).max(30),
  lastName: z.string().min(2).max(30),
});

export default User;
