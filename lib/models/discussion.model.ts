import mongoose, { mongo } from "mongoose";
import { string } from "zod";

const discussionSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author: {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    createdAt: {
        type: Date,
        default :Date.now
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Discussion'
        }
    ]
});

const Discussion = mongoose.models.Discussion || mongoose.model('Discussion', discussionSchema);

export default Discussion;