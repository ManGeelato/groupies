"use client"

import {   
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage } from "../ui/form";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from "zod"
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {usePathname, useRouter} from 'next/navigation';
import { DiscussionValidation } from "@/lib/validations/discussion";
import { createDiscussion } from "@/lib/actions/discussion.actions";
import { useOrganization } from "@clerk/nextjs";

interface AccountProfileProps{
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle :string
}

function PostDiscussion({userId}: {userId: string}) {
    const pathname = usePathname();
    const router = useRouter();
    const { organization } = useOrganization();

    const form = useForm({
        resolver: zodResolver(DiscussionValidation),
        defaultValues: {
            thread: '',
            accountId: userId,
        }
    })

    const onSubmit = async(values: z.infer<typeof DiscussionValidation>) => {
        await createDiscussion(
            {
                text: values.thread,
                author: userId,
                communityId: organization ? organization.id :  null,
                path: pathname
            }
        )
        router.push("/");
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col justify-start gap-10">
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-base-semibold text-light-2">
                        Content
                    </FormLabel>
                    <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                    <Textarea 
                        rows={15}
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="bg-[#1109D4]">
                Post
            </Button>
        </form>
    </Form>
  )
}

export default PostDiscussion;