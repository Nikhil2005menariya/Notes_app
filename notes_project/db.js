import { MongoClient } from "mongodb";

let dbconnection;

export const connectToDb = (cb) => {
    MongoClient.connect('mongodb://localhost:27017/notesapp')
        .then((client) => {
            dbconnection = client.db();
            return cb();
        })
        .catch((err) => {
            console.log(err);
            return cb(err);
        });
};

export const getDb = () => dbconnection;