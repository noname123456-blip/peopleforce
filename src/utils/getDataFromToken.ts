import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const getDataFromToken = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("token")?.value || "";
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "shaiman");
        return decoded as { id: string };
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export default getDataFromToken;