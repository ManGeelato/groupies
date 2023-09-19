import UserCard from '@/components/cards/UserCard';
import { fetchUser, fetchUsers, getActivity } from '@/lib/actions/user.actions';
import {currentUser} from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import {redirect} from 'next/navigation';

async function Page () {
  const user = await currentUser();

  if(!user) return null;

  const userInformation = await fetchUser(user.id);

  if(!userInformation?.onboarded) redirect('/onboarding');

  const activity = await getActivity(userInformation._id); 


  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
              <> 
                {activity.map((singleActivity : any) => (
                  <Link key={singleActivity._id} href={`/thread/${singleActivity.parentId}`}>
                    <article className='activity-card'>
                      <Image
                        src={singleActivity.author.image}
                        alt='Profile Picture'
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className='!text-small-regular text-light-1'>
                        <span className='mr-1 text-primary-500'>
                          
                          {singleActivity.author.name}
                        </span> {" "}
                        replied to your discussion
                      </p>
                    </article>
                  </Link>
                ))}
              </>
            ) : <p className="!text-base-regular text-light-3">No activity yet</p>
        }
      </section>
    </section>
  )
}
  
export default Page;