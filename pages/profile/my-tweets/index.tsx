import TweetList, { IMyTweet } from "@pages/components/tweetList";
import { NextPage } from "next";
import useSWR from "swr";

const Home: NextPage = () => {
  const { data, error } = useSWR<IMyTweet>(`/api/tweet/my-tweets`);

  return (
    <>
      <TweetList tweets={data?.tweets ?? []} />
    </>
  );
};

export default Home;
