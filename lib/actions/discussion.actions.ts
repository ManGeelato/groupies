"use server"

import { revalidatePath } from "next/cache";
import Discussion from "../models/discussion.model";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose"
import Community from "../models/community.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createDiscussion({ text, author, communityId, path }: Params) {
    try {

        connectToDatabase();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const createdThread = await Discussion.create({
            text,
            author,
            community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
        });

        // Update User model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id },
        });

        if (communityIdObject) {
            // Update Community model
            await Community.findByIdAndUpdate(communityIdObject, {
            $push: { threads: createdThread._id },
            });
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
    }
}

export async function fetchDiscussions(pageNumber = 1, pageSize = 20) {
    connectToDatabase();

    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Discussion.find({parentId: {$in: [null, undefined]}})
        .sort({createdAt: 'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path: 'author', model: User})
        .populate(
            {
                path: 'children', 
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId image'
                }
            }
        )
        const totalDiscussionsCount = await Discussion.countDocuments({parentId: {$in: [null, undefined]} })    

        const discussions = await postsQuery.exec();

        const isNext = totalDiscussionsCount > skipAmount + discussions.length;

        return {discussions, isNext}
}

export async function fetchDiscussionById(id: string){
    connectToDatabase();

    try {
        const discussion = await Discussion.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Discussion,
                        populate: {
                            path: 'author',
                            model: User,
                            select:'_id id name parentId image'
                        }
                    }
                ]
            }).exec();
        return discussion;
    } catch (error: any) {
        throw new Error(`Error fetching discussion: ${error.message}`)
    }
}

export async function addCommentToDiscussion(discussionId:string,commentText:string,userId:string,path:string){
    connectToDatabase();

    try {
        // find original discussion by id
        const originalDiscussion = await Discussion.findById(discussionId);
        if(!originalDiscussion){
            throw new Error('Discussion not found!');
        }
        // create new discussion with comment text
        const commentDiscussion = new Discussion({
            text: commentText,
            author: userId,
            parentId: discussionId,
        })

        // Save the new discussion
        const savedCommentDiscussion = await commentDiscussion.save();

        //Update the original discussion to include new comment
        originalDiscussion.children.push(savedCommentDiscussion._id);

        //save the original discussion
        await originalDiscussion.save();

        revalidatePath(path);
        
    } catch (error:any) {
        throw new Error(`Error adding comment to discussion: ${error.message}`)
        
    }
}