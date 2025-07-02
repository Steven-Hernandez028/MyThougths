export async function GET() {
    return Response.json({
        publicKey: process.env.VAPID_PUBLIC_KEY,
    });
}
export async function POST(req: Request) {
    const subscription = await req.json();

    // Aquí deberías guardarlo en base de datos
    console.log('Nueva suscripción:', subscription);

    return Response.json({ success: true });
}
