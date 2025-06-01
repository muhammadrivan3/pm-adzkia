import bcrypt from "bcryptjs";

// Fungsi untuk verifikasi password
export const verifyPassword = async (inputPassword: string, hashedPassword: string) => {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  return isMatch;
};
