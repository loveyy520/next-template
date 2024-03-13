import prisma from "@/lib/prismadb";
import { SafeUser } from "@/types";
import { formatDate2String } from '@/utils';
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function getCurrentUser() {

    try {
        const session = await getServerSession()
    
        if (!session?.user?.email) return null
    
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        })
    
        return formatDate2String<User, SafeUser>(currentUser!)
    } catch {
        return null
    }

}