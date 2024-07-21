"use server"

import { db } from "@/core/db/db";
import GetServerSession from "@/core/hooks/getServerSession";

interface UserProp {
    values: {
        name: string,
        location: string,
        collegeName: string,
        socialLinks: string,
        skills: string
    }
}

export const UserUpdate = async (data: UserProp) => {
    try {

        const { values } = data;
        const session = await GetServerSession();
        const email = session?.user?.email
        if (!email) {
            return { error: "not logged in" };
        }

        const user = await db.user.update({
            where: {
                email
            },
            data: {
                name: values?.name,
                location: values?.location,
                collegeName: values?.collegeName,
                socialLinks: values?.socialLinks,
                skills: values?.skills
            }
        })

        return user;
    }
    catch (error) {
        return { error: "internal error" }
    }
}