import { MongoClient } from "mongodb";

let dbconnection;

export const connectToDb = (cb) => {
    MongoClient.connect('mongodb+srv://nikhilmenariya78:KyyDnC4S4Hw2iRDL@cluster0.0uazh.mongodb.net/')
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
