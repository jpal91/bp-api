const e = require("express");
const express = require("express");
const com = express.Router();
require("dotenv").config();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, { monitorCommands: true });
const db = client.db("fe-com");
const col = db.collection("comments");

com.post("/api/add-com", async (req, res) => {
    const comment = req.body;

    comment.createdAt = new Date();

    try {
        await client.connect();

        const response = await col.insertOne(comment);

        console.log(response);

        res.send("Done");
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
});

com.get("/api/coms", async (req, res) => {
    try {
        await client.connect();

        let response = [];

        const result = await col
            .find()
            .toArray()
            // .then((r) => {
            //     console.log(r)
            //     r.forEach((el) => {
            //         !el.replyingTo ? response.push(el) : null;

            //         if (el.replies.length > 0) {
            //             el.replies = el.replies.map((resID) => {
            //                 let reply = r.findIndex(
            //                     (rComment) => rComment.comID === resID
            //                 );
            //                 return r[reply];
            //             });
            //         }
            //     });
            // });

        res.send(result);
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
});

com.post('/api/score', async (req, res) => {
    const { score, id } = req.body

    try {
        await client.connect()

        const result = await col.findOneAndUpdate(
            { comID: id },
            { $set: {score: score} },
            { returnDocument: 'after' }
        )
        console.log(result)
        res.send(result.value)
    } catch(e) {
        console.log(e)
    } finally {
        await client.close()
    }
})

module.exports = com;
