import bcrypt from "bcrypt";
import { Player } from "../domain/Player";
import jwt from "jsonwebtoken";
import sanitizedConfig from "../../config/config";

export const loginHandler = async (player: Player, password: string) => {
  const passwordMatch = await bcrypt.compare(password, player.password);
  if (!passwordMatch) {
    throw new Error("authentication failed");
  }
  const token = jwt.sign({ userId: player.id }, sanitizedConfig.JWT_SECRET, {
    expiresIn: "1h",
  });
  console.log(token);
  return token;
};
