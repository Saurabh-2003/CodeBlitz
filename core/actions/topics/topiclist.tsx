"use server";

import { db } from "@/core/db/db";

export const TopicList = async () => {
  try {
    const topiclist = await db.topic.findMany({
      select: {
        name: true,
      },
    });

    const newtopicList: string[] = topiclist.map((item) => item.name);

    return { newtopicList };
  } catch (error) {
    console.log(error);
    return { newTopicList: [], message: "Failed to fetch topics" };
  }
};
