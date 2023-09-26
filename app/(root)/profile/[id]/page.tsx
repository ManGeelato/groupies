import ProfileHeader from '@/components/shared/ProfileHeader';
import { fetchUser } from '@/lib/actions/user.actions';
import {currentUser} from '@clerk/nextjs';
import {redirect} from 'next/navigation';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import Image from 'next/image';
import DiscussionTab from '@/components/shared/DiscussionTab';


async function Page ({params} : {params : {id: string}}) {
    const user = await currentUser();

    if(!user) return null;

    const userInformation = await fetchUser(params.id);

    if(!userInformation?.onboarded) redirect('/onboarding');

  return (
    <section>
        <ProfileHeader 
            accountId={userInformation.id}
            authUserId={user.id}
            name={userInformation.name}
            username={userInformation.username}
            imgUrl={userInformation.image}
            bio={userInformation.bio}
        />

        <div className='mt-9'>
            <Tabs defaultValue='threads' className='w-full'>
                <TabsList className='tab'>
                    {profileTabs.map((tab) => (
                        <TabsTrigger
                            key={tab.label} value={tab.value} className='tab'>
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className='object-orientation'
                                />
                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === 'Threads' && (
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {userInformation?.threads.length}
                                    </p>
                                )}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {profileTabs.map((tab) => (
                    <TabsContent key={`content-${tab.label}`} value={tab.value} className='w-full text-light-1'>
                        <DiscussionTab
                            currentUserId={user.id}
                            accountId={userInformation.id}
                            accountType="User"
                        >
                        </DiscussionTab>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    </section>
  )
}

export default Page;