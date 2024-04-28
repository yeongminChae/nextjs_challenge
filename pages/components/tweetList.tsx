import { Tweet } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

interface ITweetWithCount extends Tweet {
  _count: {
    favs: number;
  };
  author: {
    name: string;
  };
}

export interface IMyTweet {
  tweets: ITweetWithCount[];
}

const TweetList = ({ tweets }: IMyTweet) => {
  const router = useRouter();
  const isCurrentPageLikedTweets = router.asPath.includes("liked-tweets");

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-10">
      <h1> {isCurrentPageLikedTweets ? "I Liked tweets" : "My tweets"} </h1>

      {tweets?.map((i) => {
        return (
          <div key={i?.id}>
            <Link href={`/tweet/${i?.id}`}>
              <a>
                <div className="flex gap-3 cursor-pointer">
                  <span>{i?.title}</span>
                  <span>{isCurrentPageLikedTweets ? i?.author.name : ""}</span>
                  <span>좋아요 : {i?._count.favs}</span>
                </div>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default TweetList;
