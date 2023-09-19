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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {usePathname, useRouter} from 'next/navigation';
import { CommentValidation } from "@/lib/validations/discussion";
import Image from 'next/image';
import { addCommentToDiscussion } from "@/lib/actions/discussion.actions";

interface Props {
    discussionId :string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({discussionId, currentUserImg, currentUserId} : Props) => {
    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: ''
        }
    })

    const onSubmit = async(values: z.infer<typeof CommentValidation>) => {
        await addCommentToDiscussion(
            discussionId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        );

        form.reset();
    }
    
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                <FormItem className="flex w-full items-center gap-3">
                    <FormLabel>
                        <Image 
                            src={currentUserImg}
                            alt="Profile image"
                            width={48} 
                            height={48}
                            className="rounded-full object-cover"
                        />
                    </FormLabel>
                    <FormControl className="border-cyan-50 bg-transparent">
                        <Input
                            type="text"
                            placeholder="Comment here..."
                            className="no-focus text-light-1 outline-none"
                            {...field}
                        />
                    </FormControl>
                </FormItem>
                )}
            />
            <Button type="submit" className="comment-form_btn">
                Send
            </Button>
        </form>
    </Form>
  )
}

export default Comment;