import mongoose from "mongoose";

const URI = `${process.env.DB_URI}`;

export default async function connectDB() {
    try {

        if (mongoose.connections[0].readyState) {
            return;
        }

        await mongoose.connect(URI).then(() => {
            console.log("DB connected successfully!")
        })
    } catch (err) {
        console.log("Error in connection DB: ", err);
    }
}