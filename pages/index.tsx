import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

import useSWR from "swr";
import { Tweet } from "@prisma/client";

import { ProfileResponse } from "./profile";

export interface ITweetstResponseWithCount extends Tweet {
  _count: {
    favs: number;
  };
}

interface ITweetResponse {
  tweets: ITweetstResponseWithCount[];
  ok: boolean;
}

const Home: NextPage = () => {
  const { user, isLoading } = useIsUser();
  const { data, error } = useSWR<ITweetResponse>("/api/tweet");

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-10">
      <h1> Hello {user?.name} </h1>
      <div className="flex flex-col gap-3">
        <Link href="/profile">
          <a> Link: To My profile page </a>
        </Link>
        <Link href="/tweet/create">
          <a> Link: Tweet Create Page </a>
        </Link>
      </div>
      {data?.tweets?.map((tweet) => {
        return (
          <div
            key={tweet?.id}
            id={tweet?.id + ""}
            className="flex flex-col gap-5"
          >
            <Link href={`/tweet/${tweet?.id}`}>
              <a>{tweet?.title}</a>
            </Link>
            <span>좋아요 수 : {tweet?._count?.favs}</span>
            <p>{tweet?.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Home;

const useIsUser = () => {
  const { data, error } = useSWR<ProfileResponse>("/api/auth/profile");
  const router = useRouter();

  useEffect(() => {
    if (data && !data?.ok) {
      router.replace("/auth/login");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
};
