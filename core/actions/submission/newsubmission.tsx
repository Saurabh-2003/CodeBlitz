"use server"

import { authOptions } from "@/core/auth/auth";
import { db } from "@/core/db/db";
import { SubmissionStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from 'uuid';

interface SubmissionProp {
    code: string,
    status: SubmissionStatus,
    problemId: string
}

export const NewSubmission = async (data: SubmissionProp) => {

    try {
        const { code, status, problemId } = data;

        const session = await getServerSession(authOptions);
        const email = session?.user?.email;

        if (!email) {
            return { error: "Not logged in" }
        }

        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return { error: "User not found" };
        }

        const submission = await db.submission.create({
            data: {
                id: uuidv4(),
                code,
                status,
                createdAt: new Date(),
                userId: user.id,
                problemId
            }
        })

        const problem = await db.problem.findUnique({
            where: {
                id: problemId
            }
        })

        if (!problem) {
            return { error: "no such Problem" };
        }

        const dif = problem.difficulty;
        if (status == "ACCEPTED") {
            if (dif == "EASY") { user.easySolved += 1; console.log(user.easySolved) }
            else if (dif == "MEDIUM") { user.mediumSolved += 1; }
            else { user.hardSolved += 1; }

        }
        const updatedUser = await db.user.update({
            where: {
                id: user.id
            },
            data: {
                easySolved: user.easySolved,
                mediumSolved: user.mediumSolved,
                hardSolved: user.hardSolved
            }
        });


        return submission;
    }
    catch (error) {
        return { error: "Internal error" }
    }

}
