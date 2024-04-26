import { useRouter } from "next/router";
import { useEffect } from "react";

import useSWR from "swr";

import { ProfileResponse } from "@pages/profile";

export const isUserLoggedIn = () => {
  const { data, error } = useSWR<ProfileResponse>("/api/auth/profile");
  const router = useRouter();

  useEffect(() => {
    if (router.pathname !== "/" && data && data?.ok) {
      router.replace("/");
    } else if (router.pathname !== "/auth/login" && data && !data?.ok) {
      router.replace("/auth/login");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
};
