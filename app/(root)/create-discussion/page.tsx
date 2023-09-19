import PostDiscussion from '@/components/forms/PostDiscussion';
import { fetchUser } from '@/lib/actions/user.actions';
import {currentUser} from '@clerk/nextjs';
import {redirect} from 'next/navigation';


async function Page() {
    const user = await currentUser();

    if(!user) return null;

    const userInformation = await fetchUser(user.id);

    if(!userInformation?.onboarded) redirect('/onboarding');
    return (
        <>
            <h1 className="head-text">Create</h1>

            <PostDiscussion userId={userInformation._id} />
        </>
    )
}

export default Page;