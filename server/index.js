
const express = require('express');
const db = require('./config/db');


const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json())

// check to see if the server is running
app.get('/', (req, res) => {
    console.log("Server is running")
    res.send("Server is running")
})
//archive table structure
//archiveID, eventID, report
// get all archive data

app.get('/api/archive', (req, res) => {
    query("SELECT * FROM archive", (err, result) => {
        if(err) {
            console.log(err)
        } else {
            // we need to send the result to the client as a json object

            res.send(result)
        }
    })
})

// save archive data
app.post('/api/archivePOST', (req, res) => {
    const data = req.body;
    query("INSERT INTO archive SET ?", data, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    })
})

// delete archive entry
app.delete('/archiveDELETE/:id', (req, res) => {
    const id = req.params.id;
    query("DELETE FROM archive WHERE id = ?", id, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Deleted")
        }
    })
})

// update archive entry
app.put('/archivePUT', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const description = req.body.description;
    query("UPDATE archive SET title = ?, description = ? WHERE id = ?", [title, description, id], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

//event table structure
//eventID, location, eventDate, startTime, endTime, price, title

// get all of the event data
app.get('/api/event', (req, res) => {
    query("SELECT * FROM event", (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

// save event data
app.post('/api/eventPOST', (req, res) => {
    const data = req.body;
    query("INSERT INTO event SET ?", data, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    })
})

// delete event entry
app.delete('/api/eventDELETE/:id', (req, res) => {
    const id = req.params.id;
    query("DELETE FROM event WHERE id = ?", id, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Deleted")
        }
    })
})

// update event entry
app.put('/api/eventPUT', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const description = req.body.description;
    query("UPDATE event SET title = ?, description = ? WHERE id = ?", [title, description, id], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

//images table structure
// imageID, filename, caption, eventID

// get all of the image data
app.get('/api/images', (req, res) => {
    query("SELECT * FROM images", (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

// get all of the image data
app.get('/api/images3', (req, res) => {
    console.log("images3 called")

    query("SELECT * from images ORDER BY RAND() LIMIT 3", (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})



// save image data
app.post('/api/imagesPOST', (req, res) => {
    const data = req.body;
    query("INSERT INTO images SET ?", data, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    })
})

// delete image entry
app.delete('/api/imagesDELETE/:id', (req, res) => {
    const id = req.params.id;
    query("DELETE FROM images WHERE id = ?", id, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Deleted")
        }
    })
})

// update image entry
app.put('/api/imagesPUT', (req, res) => {
    const imageID = req.body.imageID;
    const title = req.body.title;
    const description = req.body.caption;
    const eventID = req.body.eventID;

    //// imageID, filename, caption, eventID
    query("UPDATE images SET filename = ?, caption = ?, eventID = ? WHERE imageID = ?", [title, description, id], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

//music table structure
//musicTrackID, trackName, lyrics, soprano, alto, tenor, allParts

// get all of the music data
app.get('/api/music', (req, res) => {
    query("SELECT * FROM music", (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/api/musicPOST', (req, res) => {
    const data = req.body;
    query("INSERT INTO music SET ?", data, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    })
})

app.delete('/api/musicDELETE/:id', (req, res) => {
    const id = req.params.id;
    query("DELETE FROM music WHERE id = ?", id, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Deleted")
        }
    })
})

// update music entry
app.put('/api/musicPUT', (req, res) => {
    const id = req.body.id;
    const
    title = req.body.title;
    const description = req.body.description;
    query("UPDATE music SET trackName=? lyrics=? soprano=? alto=? tenor=? allParts=? WHERE id = ?", [title, description, id], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

// get the songlist for an event
app.get('/api/songlist/:id', (req, res) => {
    query("SELECT * FROM songlist", (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}
)
