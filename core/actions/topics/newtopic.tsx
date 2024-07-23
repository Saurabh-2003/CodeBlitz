"use server";

import { db } from "@/core/db/db";

export const NewTopic = async (topicValue: string) => {
  try {
    const newtopic = await db.topic.create({
      data: {
        name: topicValue,
      },
    });

    return newtopic;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
