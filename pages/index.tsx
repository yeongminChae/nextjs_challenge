import React, { useEffect } from "react";
import { NextPage } from "next";
import Link from "next/link";

import useSWR from "swr";
import { Tweet } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import { isUserLoggedIn } from "@libs/client/isUserLoggedIn";

export interface ITweetstResponseWithCount extends Tweet {
  _count: {
    favs: number;
  };
  author: {
    name: string;
  };
}

interface ITweetResponse {
  tweets: ITweetstResponseWithCount[];
  ok: boolean;
}

const Home: NextPage = () => {
  const { user, isLoading } = isUserLoggedIn();
  const { data, error } = useSWR<ITweetResponse>("/api/tweet");

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-10 max-h-max">
      <h1> Hello {user?.name} </h1>
      <div className="flex gap-3">
        <Link href="/profile">
          <a> To My profile page </a>
        </Link>
        <Link href="/tweet/create">
          <a> To Tweet Create </a>
        </Link>
      </div>
      {data?.tweets?.map((tweet) => {
        return (
          <div
            key={tweet?.id}
            id={tweet?.id + ""}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-5">
              <Link href={`/tweet/${tweet?.id}`}>
                <a>{tweet?.title}</a>
              </Link>
              <span>By : {tweet?.author?.name}</span>
              <span>{timeSince(tweet?.createdAt).toString()}</span>
              <span>❤️ : {tweet?._count?.favs}</span>
            </div>
            <Link href={`/tweet/${tweet?.id}`}>
              <a>
                <p>{tweet?.content}</p>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Home;

const timeSince = (date: Date) => {
  const result = formatDistanceToNow(date, { addSuffix: true, locale: ko });
  return result;
};
