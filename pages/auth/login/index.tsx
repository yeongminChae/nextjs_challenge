import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import axios, { AxiosResponse } from "axios";

import { isUserLoggedIn } from "@libs/client/isUserLoggedIn";

interface ILoginForm {
  email: string;
  password: string;
  ok: boolean;
}

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({ mode: "onSubmit" });
  const { isLoading } = isUserLoggedIn();

  const onSubmit = async (data: ILoginForm) => {
    try {
      const response = await axios.post("/api/auth/login", data);
      mutate(`/api/auth/profile`, { ...data, ok: response?.data?.ok }, false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-20">
      <h1>Log In</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-10"
      >
        <input
          {...register("email", { required: "이메일은 필수입니다." })}
          type="email"
          name="email"
          required
          placeholder="Email"
        />
        <input
          {...register("password", { required: "비밀번호는 필수입니다." })}
          type="password"
          name="password"
          required
          placeholder="Password"
        />
        <input type="submit" className="cursor-pointer" value="login" />
      </form>
    </div>
  );
};

export default Home;
