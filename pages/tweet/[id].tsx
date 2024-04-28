import { NextPage } from "next";
import { useRouter } from "next/router";

import useSWR, { mutate } from "swr";
import axios from "axios";
import { Tweet, User } from "@prisma/client";
import { format, isValid } from "date-fns";
import { ko } from "date-fns/locale";

import { cls } from "@libs/client/cls";

interface TweetWithUser extends Tweet {
  author: User;
  _count: {
    favs: number;
  };
}

interface ITweet {
  id: number;
  title: string;
  content: string;
  tweets: TweetWithUser;
  isLiked: boolean;
}

const TweetPage: NextPage = () => {
  const router = useRouter();
  const { data, error } = useSWR<ITweet>(`/api/tweet/${router.query.id}`);
  const tweet = data?.tweets;

  const onFavClick = async () => {
    if (!data) return;
    await axios.post(`/api/tweet/${router.query.id}/fav`);
    updateFavStatus(data, data?.isLiked, router.query.id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-10">
      <h1>Tweet Page</h1>

      <div key={tweet?.id} id={tweet?.id + ""} className="flex flex-col">
        <div className="flex gap-5">
          <span>{tweet?.title}</span>
          <span>작성자 : {tweet?.author.name}</span>
          <span>❤️ : {tweet?._count?.favs}</span>
        </div>
        <span>{dateFormatter(tweet?.createdAt).toString()}</span>
        <p className="mt-7">{tweet?.content}</p>
        <div className="self-center">
          <button
            onClick={onFavClick}
            className={cls(
              "flex items-center justify-center p-3",
              data?.isLiked
                ? "rounded-md text-red-400 hover:bg-red-100 hover:text-red-500"
                : "rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            )}
          >
            {data?.isLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 "
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                stroke="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetPage;

const dateFormatter = (date: Date | undefined) => {
  if (date === undefined || !isValid(new Date(date))) {
    return "날짜정보없음";
  }

  const result = format(date, "yyyy년 M월 d일 a h시", { locale: ko });
  return result;
};

const updateFavStatus = (
  data: ITweet,
  isLiked: boolean,
  routerId: string | string[] | undefined
) => {
  mutate(
    `/api/tweet/${routerId}`,
    {
      ...data,
      isLiked: !isLiked,
      tweets: {
        ...data?.tweets,
        _count: {
          favs: data?.tweets._count.favs + (isLiked ? -1 : 1),
        },
      },
    },
    false
  );

  return;
};
