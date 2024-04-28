import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export interface ITweetForm {
  title: string;
  content: string;
  authorId: number;
}

const TweetCreatePage: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ITweetForm>({ mode: "onSubmit" });
  const router = useRouter();

  const onSubmit = async (data: ITweetForm) => {
    try {
      await axios.post("/api/tweet/create", data);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-20">
      <h1>Tweet Create Page</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <input
          {...register("title", { required: "제목을 입력 해주세요." })}
          type="text"
          name="title"
          placeholder="제목을 입력 해주세요."
        />
        <input
          {...register("content", { required: "tweet을 입력 해주세요." })}
          type="text"
          name="content"
          placeholder="tweet을 입력 해주세요."
        />
        <input type="submit" value="Tweet" className="cursor-pointer" />
      </form>
    </div>
  );
};

export default TweetCreatePage;
