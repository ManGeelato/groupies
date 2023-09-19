

import DiscussionCard from "@/components/cards/DiscussionCard";
import { fetchDiscussions } from "@/lib/actions/discussion.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const discussionResults = await fetchDiscussions(1, 30);
  const user = await currentUser();

  // console.log("fdvsv", discussionResults);

  return (
    <>
      <h1 className="head-text text-left">Your Space</h1>

      <section className="mt-9 flex flex-col gap-10">
        {discussionResults.discussions.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {
              discussionResults.discussions.map((discussion) => (
                <DiscussionCard
                  key={discussion._id}
                  id={discussion._id}
                  currentUserId={user?.id || " "}
                  parentId={discussion.parentId}
                  content={discussion.text}
                  author={discussion.author}
                  community={discussion.community}
                  createdAt={discussion.createdAt}
                  comments={discussion.children}
                />
              ))
            }
          
          </>
        )
        
        
        
        
        
        }

      </section>
    </>
  )
}

