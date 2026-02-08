export const extractNameFromEmail = (email: string | null): string => {
  if (!email) return "Username";
  const localPart = email.split("@")[0];
  const match = localPart.match(/^[a-zA-Z]+/);
  return match ? match[0] : "Username";
};
