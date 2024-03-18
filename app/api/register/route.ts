import { RegisterFormSchemaType } from "@/app/login/components/user-auth-form";
import prisma from "@/lib/prismadb";
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";

async function POST(req: NextRequest) {
    const body: RegisterFormSchemaType & { name?: string } = await req.json()

    const {
        email,
        name,
        password
    } = body

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword: bcrypt.hashSync(password, 16)
        }
    })
    
    return NextResponse.json(user)
}

export {
    POST
};
