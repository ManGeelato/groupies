import ProfileHeader from '@/components/shared/ProfileHeader';
import { fetchUser } from '@/lib/actions/user.actions';
import {currentUser} from '@clerk/nextjs';
import {redirect} from 'next/navigation';


async function Page () {
    const user = await currentUser();

    if(!user) return null;

    const userInformation = await fetchUser(user.id);

    if(!userInformation?.onboarded) redirect('/onboarding');
    return (
      <section>
          <h1 className="head-text mb-10">Communities</h1>
      </section>
    )
}
  
export default Page;