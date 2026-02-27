// app/api/admin/login/route.ts
import {NextRequest, NextResponse} from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

export async function POST(request: NextRequest) {
    try {
        const {password} = await request.json();
        
        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({error: "Invalid password"}, {status: 401});
        }
        // Возвращаем успех (cookie ставится на фронте)
        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
