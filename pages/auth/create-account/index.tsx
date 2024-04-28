import { NextPage } from "next";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

interface ISignUpForm {
  email: string;
  name: string;
  password: string;
  passwordCheck: string;
}

export interface IErrorResponse {
  message: string;
}

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ISignUpForm>({ mode: "onSubmit" });

  const router = useRouter();
  const password = watch("password");

  const onSubmit = async (data: ISignUpForm) => {
    try {
      await axios.post("/api/auth/signup", data);
      router.push("/auth/login");
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-10">
      <h1>Sign Up</h1>
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
          {...register("name", { required: "이름은 필수입니다." })}
          type="text"
          name="name"
          required
          placeholder="Name"
        />
        <input
          {...register("password", { required: "비밀번호는 필수입니다." })}
          type="password"
          name="password"
          required
          placeholder="Password"
        />
        <input
          {...register("passwordCheck", {
            validate: (value: string) =>
              value === password || "비밀번호가 일치하지 않습니다.",
          })}
          type="password"
          name="passwordCheck"
          required
          placeholder="Password Check"
        />
        {errors.passwordCheck && <p>{errors.passwordCheck.message}</p>}
        <input type="submit" value="Sign Up" className="cursor-pointer" />
      </form>

      <Link href="/auth/login">
        <a>로그인 하러가기</a>
      </Link>
    </div>
  );
};

export default Home;
