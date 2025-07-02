import { getAuthenticatedUser } from "@/lib/auth/middleware";
import { getDataSource } from "@/lib/db/data-source";
import { User } from "@/lib/entities/User";
import { NextRequest } from "next/server";

export async function GET() {
    return Response.json({
        publicKey: process.env.VAPID_PUBLIC_KEY,
    });
}
export async function PUT(req: NextRequest) {
    const { payload, IsRemoved } = await req.json();

    const dataSource = await getDataSource();
    const user = await getAuthenticatedUser(req);

    if (user !== null) {
        const { id } = user;
        const userRepository = dataSource.getRepository(User);

        const existingUser = await userRepository.findOne({ where: { id } });

        if (existingUser) {
            existingUser.susbcription = IsRemoved == 1 ? null : payload;
            await userRepository.save(existingUser);
        } else {
            return new Response("User not found", { status: 404 });
        }

        return Response.json({ success: true });
    }

    return new Response("Unauthorized", { status: 401 });
}
