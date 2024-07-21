"use server"

import { db } from "@/core/db/db";
import GetServerSession from "@/core/hooks/getServerSession";
import { error } from "console";


export const Submissions = async () => {
    try {

        const session = await GetServerSession();
        const email = session?.user?.email;

        if (!email) {
            return { error: "Not logged in" }
        }

        const user = await db.user.findUnique({
            where: {
                email
            }
        })


        const submissions = await db.submission.findMany({
            where: {
                userId: user?.id
            }
        })
        if (!submissions.length) {
            return { error: "No submissions Found" };
        }

        // Fetch problem titles for each submission
        const problemTitles = await Promise.all(
            submissions.map(async (submission) => {
                const problem = await db.problem.findUnique({
                    where: {
                        id: submission.problemId
                    },
                    select: {
                        title: true
                    }
                });

                return problem?.title;
            })
        );

        return { submissions, problemTitles };
    }
    catch (error) {
        return { error: "Internal error" }
    }

}