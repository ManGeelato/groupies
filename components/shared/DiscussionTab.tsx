import { fetchUserPosts } from "@/lib/actions/user.actions";
import {redirect} from 'next/navigation';
import DiscussionCard from "../cards/DiscussionCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const DiscussionTab = async ({currentUserId, accountId, accountType} : Props) => {
    let fetchResults: any;

    if(accountType === 'Community'){
        fetchResults = await fetchCommunityPosts(accountId)
    }else{
        fetchResults = await fetchUserPosts(accountId);
    }

    if(!fetchResults) redirect('/');

  return (
    <section>
        {fetchResults.threads.map((discussion : any) => (
            <DiscussionCard
                key={discussion._id}
                id={discussion._id}
                currentUserId={currentUserId}
                parentId={discussion.parentId}
                content={discussion.text}
                author={
                    accountType === 'User'
                    ? {name: fetchResults.name, image: fetchResults.image, id: fetchResults.id}
                    : {name: discussion.author.name, image: discussion.author.image, id: discussion.author.id}
                }
                community={discussion.community}
                createdAt={discussion.createdAt}
                comments={discussion.children}
            />
        ))}
    </section>
  )
}

export default DiscussionTab