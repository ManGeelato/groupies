import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if(!user) return null;

    const userInformation =  await fetchUser(user.id);
    if(userInformation?.onboarded) redirect("/");

    const userData = {
        id: user.id,
        objectId: userInformation?._id,
        username: userInformation ?  userInformation?.username : user?.username,
        name: userInformation ? userInformation?.name : user?.firstName ?? '',
        bio: userInformation ?  userInformation?.bio : '',
        image: userInformation ?  userInformation?.image : user.imageUrl,
    }


    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Let Us Know You</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Set up your profile now to use Groupies
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile 
                    user={userData}
                    btnTitle="Go"
                />
            </section>
        </main>
    )
}

export default Page