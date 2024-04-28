import React from "react";
import { NextPage } from "next";

import { User } from "@prisma/client";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { useRouter } from "next/router";

export interface ProfileResponse {
  ok: boolean;
  profile: User;
}

const Home: NextPage = () => {
  const router = useRouter();
  const { data, error } = useSWR<ProfileResponse>("/api/auth/profile");

  const onLogOut = async () => {
    try {
      await axios.post("/api/auth/profile");
      mutateProfile();
    } catch (error) {
      console.log(error);
    }
  };

  const mutateProfile = () => {
    mutate("/api/auth/profile", { ...data, ok: false }, false);
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-10">
      <h1> Hello {data?.profile.name} </h1>
      <div className="flex flex-col gap-5">
        <Link href="/profile/my-tweets">
          <a>To my tweets &rarr;</a>
        </Link>
        <Link href="/profile/liked-tweets">
          <a>To my fav tweets &rarr;</a>
        </Link>
      </div>
      <button onClick={onLogOut}>Log Out</button>
    </div>
  );
};

export default Home;
