// app/api/admin/login/route.ts
import {NextRequest, NextResponse} from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

export async function POST(request: NextRequest) {
    try {
        const {password} = await request.json();
        console.log({
            msg: "LOGIN API",
            password,
        });
        if (password !== ADMIN_PASSWORD) {
            console.log({
                msg: "LOGIN API FAIL",
                password,
            });
            return NextResponse.json({error: "Invalid password"}, {status: 401});
        }
        console.log({
            msg: "LOGIN API SUCCESS",
            password,
        });
        // Возвращаем успех (cookie ставится на фронте)
        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
