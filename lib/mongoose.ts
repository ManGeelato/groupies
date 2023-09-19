import mongoose, { mongo } from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGO_DB_URI) return console.log('Mongo DB connection not found');
    if(isConnected) return console.log('Already connected to Mongo DB');

    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        isConnected = true;

        console.log('Successfully connected to Mongo DB');
    } catch (error) {
        console.log("error" ,error);
    }
}