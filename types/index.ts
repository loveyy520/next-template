import { User } from "@prisma/client";

type SafeUser = (Omit<
    User,
    'createAt' | 'updateAt' | 'emailVerified'
> & {
    createAt: string
    updateAt: string
    emailVerified: string
})

export {
    type SafeUser
};
