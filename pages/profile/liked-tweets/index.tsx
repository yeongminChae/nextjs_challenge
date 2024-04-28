import { NextPage } from "next";
import useSWR from "swr";
import TweetList, { IMyTweet } from "@pages/components/tweetList";

const Home: NextPage = () => {
  const { data, error } = useSWR<IMyTweet>(`/api/tweet/liked-tweets`);

  return (
    <>
      <TweetList tweets={data?.tweets ?? []} />
    </>
  );
};

export default Home;
