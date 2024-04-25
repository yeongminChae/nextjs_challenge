import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import useSWR from "swr";
import { User } from "@prisma/client";
import Link from "next/link";

export interface ProfileResponse {
  ok: boolean;
  profile: User;
}

const Home: NextPage = () => {
  const { user, isLoading } = useIsUser();

  return (
    <div>
      <h1> Hello {user?.name} </h1>
      <Link href="/tweet/create">
        <a> Link: Tweet Create Page </a>
      </Link>
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
