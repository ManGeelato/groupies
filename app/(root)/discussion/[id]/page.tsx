import React from 'react';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import DiscussionCard from '@/components/cards/DiscussionCard';
import { redirect } from 'next/navigation';
import { fetchDiscussionById, fetchDiscussions } from '@/lib/actions/discussion.actions';
import Comment from '@/components/forms/Comment';

const page = async ({params} : {params: {id: string}}) => {
    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInformation = await fetchUser(user.id);
    if(!userInformation?.onboarded) redirect('/onboarding')

    const discussion = await fetchDiscussionById(params.id);

  return (
    <section className='relative'>
        <div>
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
        </div>

        <div className='mt-7'>
            <Comment
                discussionId={discussion.id}
                currentUserImg={userInformation.image}
                currentUserId={JSON.stringify(userInformation._id)}
            />
        </div>

        <div className='mt-10'>
            {
                discussion.children.map((childItem: any) => (
                    <DiscussionCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user?.id || " "}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment
                    />
                ))
            } 
        </div>
    </section>
  )
}

export default page