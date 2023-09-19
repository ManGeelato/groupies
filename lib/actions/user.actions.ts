"use server"

import { connectToDatabase } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Discussion from "../models/discussion.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser(
    {
        userId,
        username,
        name,
        bio,
        image,
        path
    } : Params
): Promise<void>{
    connectToDatabase();

    try {
        await User.findOneAndUpdate(
            {id: userId},
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            {upsert: true}
        );
    
        if(path === '/profile/edit'){
            revalidatePath(path)
        }
    } catch (error : any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}

export async function fetchUser(userId:string){
    try{
        connectToDatabase();

        return await User
            .findOne({id: userId})
            // .populate([
            //     path: 'communities',
            //     model: Community
            // ])
    }catch(error: any){
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDatabase()

        const discussions = await User.findOne({id: userId})
            .populate({
                path: 'threads',
                model: Discussion,
                populate: {
                    path: 'children',
                    model: Discussion,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            })
        return discussions;
    } catch (error :any) {
        throw new Error(`Failed to fetch user discussions: ${error.message}`);
    }
}

export async function fetchUsers ({
    userId,
    searchString = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
} : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDatabase();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");      

        const query: FilterQuery<typeof User> = {
            id: {$ne: userId}
        }    
        
        if(searchString.trim() !== '' ) {
            query.$or = [
                {username: {$regex: regex}},
                {name: { $regex: regex}}
            ]
        }

        const sortOptions = {createdAt: sortBy};

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);
        const users = await usersQuery.exec();
        const isNext = totalUsersCount > skipAmount + users.length;

        return {users, isNext};
    } catch (error: any) {
        throw new Error(`Faield to fetch users: ${error.message}`);
    }
}

export async function getActivity (userId: string){
    try{
        connectToDatabase();

        const userDiscussions = await Discussion.find({author : userId});

        const childThreads = userDiscussions.reduce((accumulate, userDiscussion) => {
            return accumulate.concat(userDiscussion.children)
        }, [])

        const replies = await Discussion.find({
            _id: {$in: childThreads},
            author:  {$ne: userId}
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })
        return replies;
    }catch(error :any){
        throw new Error(`Failed to fetch: ${error.message}`)
    }
}

