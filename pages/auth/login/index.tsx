import { NextPage } from "next";
import { useForm } from "react-hook-form";

interface ILoginForm {
  email: string;
  password: string;
}

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({ mode: "onSubmit" });

  const onSubmit = (data: ILoginForm) => {
    console.log(data);
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
        <input type="submit" />
      </form>
    </div>
  );
};

export default Home;
