require('dotenv').config(__dirname + '/.env')
import { EmptyEventDetails, EmptyArchiveEntry, EventDetails, ArchiveEntry } from "../types/types"; 
const express = require('express');
const db = require('./config/db');
// on the server the upload folder is in the public folder
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const app = express();

app.use(cors());
app.use(express.json())
// import the pool from the db.js file
// an error is thrown because the path module is not defined
// the path module is a core module in node.js so it should be available
const path = require('path');
const { arch } = require('os');
const { get } = require('http');
app.use(express.static(path.join(__dirname, 'public/')));

// // connect to the database

// // check to see if the server is running
// app.get('/', (req, res) => {
//     console.log("Server is running")
//     res.send("Server is running")
// })


// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './public/images/')
//     }
//     ,
//     filename: function(req, file, cb) {
//         cb(null, file.originalname)
//     }
// })

// const storage2 = multer.diskStorage({
//     // the destination folder is not defined
//     destination: function(req, file, cb) {
//         cb(null, './public/images/mobile/')
//     }
//     ,
//     filename: function(req, file, cb) {
//         cb(null, file.originalname)
//     }
// })

// const upload = multer({ storage: storage })

// const upload2 = multer({ storage: storage2 })

// we need to convert the upload function to a promise so that we can use the data in the function


//app.post('/upload', upload.single('file'), (req, res) => {
    //console.log(req)
export function upload(req: any, res: any) {
    new Promise((resolve, reject) => {    
    let eventID = req.body.eventID;
    let filename = req.file.filename;
    let caption = '';
    let width = req.body.width;
    let height = req.body.height;
    //console.log("filename : "+filename+ " eventID : "+eventID+ " caption : "+caption+ " width : "+width+ " height : "+height)
    db.query("INSERT INTO images SET filename = ?, eventID = ?, caption = ?, width = ?, height = ?", [filename, eventID, caption, width, height], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            //console.log("Values Inserted")
            // get the imageID of the last inserted image
            db.query("SELECT LAST_INSERT_ID()", (err: any, result: any) => {
                if(err) {
                   reject(console.log(err))
                } else {
                    let imageID = result[0];
                   resolve(res.json({ imageID: imageID }));
                }
            })
        }
    })
})


//app.post('/uploadLogo', upload.single('file'), (req, res) => {
export function uploadLogo(body: any, res: any) {
    new Promise((resolve, reject) => {

    let eventID = -1;
    let filename = body.filename;
    let width = body.width;
    let height = body.height;
    let caption = body.caption;
    //console.log("filename : "+filename+ " eventID : "+eventID+ " caption : "+caption+ " width : "+width+ " height : "+height)
    db.query("INSERT INTO images SET filename = ?, eventID = ?, caption = ?, width = ?, height = ?", [filename, eventID, caption, width, height], (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            //console.log("Values Inserted")
            // get the imageID of the last inserted image
            db.query("SELECT LAST_INSERT_ID()", (err: any, result: any) => {
                if(err) {
                    reject(console.log(err))
                } else {
                    let imageID = result[0];
                    resolve(res.json({ imageID: imageID }));
                }
            })
        }
    })
})

//app.post('/uploadBackground', upload.single('file'), (req, res) => {
export function uploadBackground(body: any, res: any) {
    new Promise((resolve, reject) => {
    let eventID = 0;
    let filename = body.filename;
    let width = body.width;
    let height = body.height;
    let caption = body.caption;
    // console.log("filename : "+filename+ " eventID : "+eventID+ " caption : "+caption+ " width : "+width+ " height : "+height)
    db.query("INSERT INTO images SET filename = ?, eventID = ?, caption = ?, width = ?, height = ?", [filename, eventID, caption, width, height], (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            reject(console.log("Values Inserted"))
            // get the imageID of the last inserted image
            db.query("SELECT LAST_INSERT_ID()", (err: any, result: any) => {
                if(err) {
                    console.log(err)
                } else {
                    let imageID = result[0];
                    resolve(res.json({ imageID: imageID }));
                }
            })
        }
    })
})


export function archives(req: number, res: any) {
// app.get('/archives/:lastReq', (req, res) => {
    let archs: ArchiveEntry[] = [];
    // create a promise to get the archive data that returns an array of archive objects
    
    var archivesRequired = req.params.lastReq;
// make sure that the archivesRequired is a number
archivesRequired = parseInt(archivesRequired)
// create a promise to get the archive data
let archivePromise = new Promise((resolve, reject) => {
    db.query("SELECT archive.archiveID, choirevents.location, choirevents.eventDate, choirevents.title, archive.report, archive.eventID FROM choirevents join archive on archive.eventID=choirevents.eventID order by choirevents.eventDate LIMIT ?;", archivesRequired, (err: any, result: any) => {
        if(err) {
            console.log("scadC "+err.message)
        } else {
            // archs is an array of archive objects
            for (var i = 0; i < result.length; i++) {
                var EventD: EventDetails = EmptyEventDetails();
                EventD.eventID = result[i].eventID;
                EventD.location = result[i].location;
                EventD.eventDate = result[i].eventDate;
                EventD.title = result[i].title;
                var archive = EmptyArchiveEntry();
                archive.archiveID = result[i].archiveID,
                archive.report= result[i].report
                archive.eventDetails = EventD;
                archs = [...archs, archive]   
            }
            }
            resolve(archives)
        }
    )}
)
    

    // wait for the promise to resolve and then send the data to the client
archivePromise.then((archs) => {
    
   // console.log(archives)
    var events: number[] = []
    for (var i = 0; i < archives.length; i++) {
        events = [...events, archs[i].eventDetails.eventID]
    }
   // console.log(events)
        // set up a promise to get all of the images and pass the array of events to the promise
    let imagesPromise = new Promise((resolve, reject) => {
        db.query("SELECT * FROM images WHERE eventID = ?", events, (err: any, result: any) => {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                var images = []
                for (var i = 0; i < result.length; i++) {
                    var image = {
                        imageID: 0,
                        filename: "",
                        caption: "",
                        eventID: 0
                    }
                    image.imageID = result[i].imageID;
                    image.filename = result[i].filename;
                    image.caption = result[i].caption;
                    image.eventID = result[i].eventID;
                    images = [...images, image]
                }
                resolve(images)
            }
        }
        )
    })

    let clipsPromise = new Promise((resolve, reject) => {   
        db.query("SELECT * FROM clips WHERE eventID = ?", events, (err: any, result: any) => {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                var clips = []
                for (var i = 0; i < result.length; i++) {
                    var clip = {
                        clipID: result[i].clipID,
                        clipURL: result[i].clipURL,
                        eventID: result[i].eventID,
                        caption: result[i].caption
                    }
                    clips = [...clips, clip]
                }
                resolve(clips)
            }
        }
        )
    })

    // we need to use the Promise.all() method to get the data from the promises
    Promise.all([imagesPromise, clipsPromise])
    .then((values) => {
        var images = values[0];
        var clips = values[1];
        for (var i = 0; i < archives.length; i++) {
            for (var j = 0; j < images.length; j++) {
                if (archives[i].eventDetails.eventID == images[j].eventID) {
                    archives[i].images = [...archives[i].images, images[j]]
                }
            }
            for (var j = 0; j < clips.length; j++) {
                if (archives[i].eventDetails.eventID == clips[j].eventID) {
                    archives[i].clips = [...archives[i].clips, clips[j]]
                }
            }
        }
//        console.log(archives)
        res.send(archives)

    }
    )
    .catch((err) => {
        console.log(err)
        res.send("Archive not found")
    })
}
)
})
// the getArchive function is not defined in the code above


app.get('/messages', (req, res) => {
    db.query("SELECT * FROM messages", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

// messageID, messageDate, messageFrom, messageContent

app.post('/messages', (req, res) => {
    const data = req.body;
    // the time stamp is not being set in the data object and so the server needs to set the time stamp
    data.messageDate = new Date();
    console.log(data.messageDate)
    db.query("INSERT INTO messages SET messageDate = ?, messageFrom = ?, messageContent = ?", [data.messageDate, data.messageFrom, data.messageContent], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            // get the messageID of the last inserted message
            db.query("SELECT LAST_INSERT_ID()", (err: any, result: any) => {
                if(err) {
                    console.log(err)
                } else {
                    let messageID = result[0];
                    res.json({ messageID: messageID });
                }
            })
//            res.send("Values Inserted")
        }
    }
    )
})

app.delete('/messages/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM messages WHERE messageID = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Deleted")
        }
    })
})

// This section is the username and password section.  We obviously want this section to be secure
// and so we need to use a secure method to store the username and password
// the usernames and passwords are stored in the .env file and are accessed using the process.env object
// the .env file is not included in the repository and so the username and password are not available to the public

app.post('/login', (req, res) => {
    console.log(req.body)
    // retrieve the users array from the .env file
    let users = process.env.users
    // users is a json object and so we need to parse the json object to get the array
    users = JSON.parse(users)    
    console.log(users) 
    console.log(users.length)
    for (let i = 0; i < users.length; i++) {
        if (req.body.username === users[i].username && req.body.password === users[i].password && req.body.role === users[i].role) {
            // return staus 200 if the login is successful
            res.status(200).send({message: "Updated post successfuly"})
            return
        }
    }
    res.status(401).send({message: "Login failed"})

}
)


app.post('/loginAddUser', (req, res) => {
    // add the username and password to the .env file
    process.env.users = [...process.env.users, { username: req.body.username, password: req.body.password, role: req.body.role }]
    res.send("User Added")
})

app.post('/loginDeleteUser', (req, res) => {
    // delete the username and password from the .env file
    process.env.users = process.env.users.filter(user => user.username !== req.body.username)
    res.send("User Deleted")
})

// // there is an unclosed bracket in theabove.  This is most likely from line 
// function EmptyEventDetails() {
//     return {
//         eventID: 0,
//         location: "",
//         eventDate: new Date(),
//         startTime: "",
//         endTime: "",
//         invitation: "",
//         meetingPoint: "",
//         price: "",
//         title: "",
//         playlist: [],
//     };
// }
 function EmptyPlaylistEntry() {
    return {
        playlistID: 0,
        eventID: 0,
        musicTrack: EmptyMusicTrack(),
        playorder: 0
    };
}
function EmptyMusicTrack() {
    return {
        musicTrackID: 0,
        trackName: "",
        artist: "",
        lyrics: "",
        soprano: "",
        alto: "",
        tenor: "",
        allParts: ""
    };
}


app.get('/upcomingPlaylists', (req, res) => {
    let event = emptyEventDetails();
    let plist = [];
    db.query("SELECT choirevents.eventID, choirevents.location, choirevents.eventDate, choirevents.startTime, choirevents.endTime, choirevents.title, choirevents.meetingPoint, playlists.playlistID, playlists.musicID, playlists.playorder, music.musicTrackID, music.trackName, music.artist, music.lyrics, music.soprano, music.alto, music.tenor, music.allParts FROM choirevents LEFT OUTER JOIN (playlists JOIN music on playlists.musicID=music.musicTrackID) on choirevents.eventID=playlists.eventID where choirevents.eventDate>= curdate() order by choirevents.eventDate, playlists.playorder")
    .then((result) => {
        var events = []
        var pList = []
        id = 0;
        var len = result.length;
        for (var i = 0; i < len; i++) {
            if (result[i].eventID != id) {
                var event = emptyEventDetails();
                 
                    event.eventID= result[i].eventID,
                    event.location= result[i].location,
                    event.eventDate= result[i].eventDate,
                    event.startTime= result[i].startTime,
                    event.endTime= result[i].endTime,
                    event.title= result[i].title,
                    event.meetingPoint= result[i].meetingPoint,
                    event.playlist= []
                }
            var plEntry = EmptyPlaylistEntry();
            plEntry.playlistID= result[i].playlistID
            mTrack = EmptyMusicTrack();
            mTrack.musicTrackID= result[i].musicID,
            mTrack.trackName= result[i].trackName,
            mTrack.artist= result[i].artist,
            mTrack.lyrics= result[i].lyrics,
            mTrack.soprano= result[i].soprano,
            mTrack.alto= result[i].alto,
            mTrack.tenor= result[i].tenor,
            mTrack.allParts= result[i].allParts
            plEntry.musicTrack= mTrack
            plEntry.playorder= result[i].playorder
    
            pList = [...pList, plEntry]
            if (i== result.length-1 || result[i+1].eventID != result[i].eventID) {
                event.playlist = pList
                pList = []
                events = [...events, event]
            }
            id = result[i].eventID
        }
        res.send(events)
    })
    .catch((err) => {
        console.log(err)
        res.send("No events found")
    })
})



const EventDetails = {
    eventID: 0,
    location: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    price: 0,
    title: "",
    playlist: []
}
function emptyEventDetails() {
    return {
        eventID: 0,
        location: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        price: 0,
        title: "",
        playlist: []
    }
}
// function emptyArchiveEntry() {
//     return {
//         archiveID: 0,
//         report: "",
//         images: [],
//         clips: []
//     }
// }

app.get('/eventarchive/:id', (req, res) => {
    const id = req.params.id;


    // we want the archive function to act as a promise so that we can use the data in the function
    // we need to use the .then() method to get the data from the function by using the syuntax 
let archivePromise = new Promise((resolve, reject) => { 
    var archive = {
        archiveID: 0,
        eventDetails: emptyEventDetails(),
        report: "",
        images: [],
        clips: []
    }
    // console.log("id : "+id)
    
     db.query("SELECT archive.archiveID, choirevents.location, choirevents.eventDate, choirevents.title, archive.report FROM choirevents join archive on archive.eventID=choirevents.eventID WHERE archive.eventID= ? ", id, (err: any, result: any) => {
        if(err) {
            reject(err)
        } else {
            // create an archive object

            // console.log("result archive : "+result.length)
            for (var i = 0; i < result.length; i++) {
                archive.archiveID = result[i].archiveID;
                archive.report = result[i].report;
                archive.eventDetails.eventID = result[i].eventID;
                archive.eventDetails.location = result[i].location;
                archive.eventDetails.eventDate = result[i].eventDate;
            }
            resolve(archive)
        }
    }
    )
})
 
imagesPromise = new Promise((resolve, reject) => {
    db.query("SELECT * FROM images WHERE eventID = ?", id, (err: any, result: any) => {
        if(err) {
            reject(err)
        } else {
            var images = []
            for (var i = 0; i < result.length; i++) {
                var image = {
                    imageID: 0,
                    filename: "",
                    caption: "",
                    eventID: 0
                }
                image.imageID = result[i].imageID;
                image.filename = result[i].filename;
                image.caption = result[i].caption;
                image.eventID = result[i].eventID;

                images = [...images, image]
            }
            resolve(images)
        }
    }
    )
})
clipsPromise = new Promise((resolve, reject) => {
    db.query("SELECT * FROM clips WHERE eventID = ?", id, (err: any, result: any) => {
        if(err) {
            reject(err)
        } else {
            var clips=[]
            for (var i = 0; i < result.length; i++) {
                var clip = {
                    clipID: result[i].clipID,
                    clipURL: result[i].clipURL,
                    eventID: result[i].eventID,
                    caption: result[i].caption
                }

                clips = [...clips, clip]
            }
            resolve(clips)
        }
    }
    )
})
    // we need to use the Promise.all() method to get the data from the promises        
Promise.all([archivePromise, imagesPromise, clipsPromise])
.then((values) => {
    var archive = values[0];    
    archive.images = values[1];
    archive.clips = values[2];
    // return the archive object

   res.send(archive)
})
.catch((err) => {
    console.log(err)
    res.send("Archive not found")
})
}
)

app.get('/colors', (req, res) => {
    db.query("SELECT * FROM colors", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/themedetails', (req, res) => {
    db.query("SELECT * FROM themedetails", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

//themeDetails, boxColour, textColour, textFont, backgroundImage, textboxColour, logoimage, bannerColour, menuColour, buttonColour, buttonHover, buttonTextColour, menuTextColour
app.put('/themedetailsPUT', (req, res) => {
    const data = req.body;
    db.query("UPDATE themedetails SET boxColour = ?, textColour = ?, textFont = ?, backgroundImage = ?, textboxColour = ?, logoimage = ?, bannerColour = ?, menuColour = ?, buttonColour = ?, buttonHover = ?, buttonTextColour = ?, menuTextColour = ?, textSize = ?", [data.boxColour, data.textColour, data.textFont, data.backgroundImage, data.textboxColour, data.logoimage, data.bannerColour, data.menuColour, data.buttonColour, data.buttonHover, data.buttonTextColour, data.menuTextColour, data.textSize], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Updated")
        }
    })
})

// create an SQL statement updating the colour value of the themeDetails table to random colors with the textfont being impact and the logoimage being the choir logo
app.get('/themedetailsRandom', (req, res) => {
    // create an array of colours
    data = {
        boxColour: '#'+Math.floor(Math.random()*16777215).toString(16),
        textColour: '#'+Math.floor(Math.random()*16777215).toString(16),
        textFont: 'Impact',
        backgroundImage: 'Musical Background.png',
        textboxColour: '#'+Math.floor(Math.random()*16777215).toString(16),
        logoimage: 'Choir Logo.png',
        bannerColour: '#'+Math.floor(Math.random()*16777215).toString(16),
        menuColour: '#'+Math.floor(Math.random()*16777215).toString(16),
        buttonColour: '#'+Math.floor(Math.random()*16777215).toString(16),
        buttonHover: '#'+Math.floor(Math.random()*16777215).toString(16),
        buttonTextColour: '#'+Math.floor(Math.random()*16777215).toString(16),
        menuTextColour: '#'+Math.floor(Math.random()*16777215).toString(16)
    }
    db.query("UPDATE themedetails SET boxColour = ?, textColour = ?, textFont = ?, backgroundImage = ?, textboxColour = ?, logoimage = ?, bannerColour = ?, menuColour = ?, buttonColour = ?, buttonHover = ?, buttonTextColour = ?, menuTextColour = ?", [data.boxColour, data.textColour, data.textFont, data.backgroundImage, data.textboxColour, data.logoimage, data.bannerColour, data.menuColour, data.buttonColour, data.buttonHover, data.buttonTextColour, data.menuTextColour], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Updated")
        }
    })
})

// get music list
//musicTrackID, trackName, lyrics, soprano, alto, tenor, allParts
app.get('/trackList', (req, res) => {
    db.query("SELECT musicTrackID, trackName, artist FROM music", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            for(var i = 0; i < result.length; i++) {
                var musicTrackID = result[i].musicTrackID;
                var trackName = result[i].trackName;
                var artist = result[i].artist;
                var musicTrack = {
                    id: i,
                    musicTrackID: musicTrackID,
                    trackName: trackName,
                    artist: artist
                }
                result[i] = musicTrack;
            }
            res.send(result)
        }
    })
})


app.get('/archive', (req, res) => {
    db.query("SELECT * FROM archive", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            // we need to send the result to the client as a json object

            res.send(result)
        }
    })
})

// save archive data
app.post('/archivePOST', (req, res) => {
    const data = req.body;
    // check for any archive entries with the same eventID
    db.query("SELECT * FROM archive WHERE eventID = ?", [data.eventID], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            if(result.length > 0) {
                // if there is an entry with the same eventID then update the entry
                db.query("UPDATE archive SET report = ? WHERE eventID = ?", [data.report, data.eventID], (err: any, result: any) => {
                    if(err) {
                        console.log(err)
                    } else {
                        uploadClips(data.clips)
                        res.send("Value Updated")
                    }
                })
            } else {
                // if there is no entry with the same eventID then insert a new entry
                db.query("INSERT INTO archive  (report, eventID) VALUES (?,?)", [data.report, data.eventID], (err: any, result: any) => {
                    if(err) {
                        console.log(err)
                    } else {
                        uploadClips(data.clips)
                        res.send("Values Inserted")
                    }
                })
            }
        }
    })

})

function uploadClips(clips) {
    // if the clipID is >10000 then it is a new clip, otherwisw it needs to be updated
    for(var i = 0; i < clips.length; i++) {
        if (clips[i].id > 10000) {
            db.query("INSERT INTO clips (clipURL, eventID, caption) VALUES (?,?,?)", [clips[i].clipURL, clips[i].eventID, clips[i].caption], (err: any, result: any) => {
                if(err) {
                    console.log(err)
                }
            })
        } else {
        db.query("UPDATE clips SET clipURL=? , eventID=?, caption=? WHERE clipID=?", [clips[i].clipURL, clips[i].eventID, clips[i].caption, clips[i].id], (err: any, result: any) => {
            if(err) {
                console.log(err)
            }
        })
    }
    }
}



// delete archive entry
app.delete('/archiveDELETE/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM archive WHERE id = ?", id, (err: any, result: any) => {
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
    db.query("UPDATE archive SET title = ?, description = ? WHERE id = ?", [title, description, id], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

// get a playlist for an event
app.get('/playlists/:id', (req, res) => {
    const id = req.params.id;
    db.query("SELECT playlistID, playorder, musicTrackID, trackName, artist from playlists join music on playlists.musicID=music.musicTrackID WHERE playlists.eventID=? order by playorder", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            //console.log(result)
            let playlist = [];
            for(var i = 0; i < result.length; i++) {
                var playlistEntry = {
                    id: i,
                    playlistID: result[i].playlistID,
                    playorder: result[i].playorder,
                    eventID: id,
                    musicTrack: {
                        musicTrackID: result[i].musicID,
                        trackName: result[i].trackName,
                        artist: result[i].artist
                    },
                }
                // add the playlistEntry to the playlist array using the spread operator
                playlist = [...playlist, playlistEntry]

            }
            res.send(playlist)
        }
    })
})

app.post('/playlistsPOST', (req, res) => {
    // convert the data to a json object.  The data is sent as an array of playlistEntry objects
    const data = req.body;
    // find the eventID from the first entry in the array
    const eventID = data[0].eventID;
    // delete all of the existing playlist entries for the event
    db.query("DELETE FROM playlists WHERE eventID = ?", eventID, (err: any, result: any) => {
        if(err) {
            console.log(err)
        }
    })
    for(var i = 0; i < data.length; i++) {
        db.query("INSERT INTO playlists (eventID, musicID, playorder) VALUES (?, ?, ?)", [data[i].eventID, data[i].musicTrack.musicTrackID, data[i].playorder], (err: any, result: any) => {
            if(err) {
                console.log(err)
            } else {
                result.send("Values Inserted")
            }
        })
    }
})

//event table structure
//eventID, location, eventDate, startTime, endTime, price, title

// get all of the event data
app.get('/events', (req, res) => {
    db.query("SELECT * FROM choirevents", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            // load the results into an array of eventDetails
            for(var i = 0; i < result.length; i++) {
                var eventID = result[i].eventID;
                var location = result[i].location;
                var eventDate = result[i].eventDate;
                var startTime = result[i].startTime;
                var endTime = result[i].endTime;
                var price = result[i].price;
                var title = result[i].title;
                var playlist = [];
                var eventDetails = {
                    id: i,
                    eventID: eventID,
                    location: location,
                    eventDate: eventDate,
                    startTime: startTime,
                    endTime: endTime,
                    price: price,
                    title: title,
                    playlist: playlist,
                    archive: {
                        archiveID: 0,
                        eventID: 0,
                        report: "",
                        images: [],
                        clips: []
                    }
                }
                result[i] = eventDetails;
            }
            res.send(result)
        }
    })
})

// save event data
app.post('/eventPOST', (req, res) => {
    // the event data is sent as an eventDetails json object. So we need to extract the data from the object
    // create a new eventDetails object and load the data into it
   // console.log(req.body)
    var location = req.body.location;
    var invitation = req.body.invitation;
    var eventDate = req.body.eventDate;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var meetingPoint = req.body.meetingPoint;
    var price = req.body.price;
    var title = req.body.title;

    db.query("INSERT INTO choirevents SET location = ?, eventDate = ?, startTime = ?, endTime = ?, price = ?, title = ?, invitation = ?, meetingPoint = ? ", [location, eventDate, startTime, endTime, price, title, invitation, meetingPoint], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    })
})

// delete event entry
app.delete('/eventDELETE/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM event WHERE id = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Deleted")
        }
    })
})

// update event entry
app.put('/eventPUT', (req, res) => {
    var location = req.body.location;
    var eventDate = req.body.eventDate;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var price = req.body.price;
    var title = req.body.title;
    db.query("UPDATE event SET location = ?, eventDate = ?, startTime = ?, endTime = ?, price = ?, title = ? WHERE id = ?", [location, eventDate, startTime, endTime, price, title], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

app.get('/siteinfo', (req, res) => {
    db.query("SELECT * FROM siteinfo", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})


//id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText
app.post('/siteinfoPUT', (req, res) => {
    const data = req.body;
    //console.log(req.body)
    db.query("UPDATE siteinfo SET HomeTitle = ?, HomeText = ?, AboutTitle = ?, AboutText = ?, ArchiveTitle = ?, ArchiveText = ?, NoticesTitle = ?, NoticesText = ?, BookingTitle = ?, BookingText = ?, MembersTitle = ?, MembersText = ?, AppealTitle = ?, AppealText = ?, SettingsTitle = ?, SettingsText = ? ", [data.titleHome, data.descriptionHome, data.titleAbout, data.descriptionAbout, data.titleArchive, data.descriptionArchive, data.titleNotices, data.descriptionNotices, data.titleBooking, data.descriptionBooking, data.titleMembers, data.descriptionMembers, data.titleAppeal, data.descriptionAppeal, data.titleSettings, data.descriptionSettings], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Updated")
        }
    })
})


// clip table: clipID, clipURL, eventID, caption
// playlist table: playlistID, eventID, musicID, playorder

// get single event details
app.get('/event/:id', (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM event WHERE id = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {

            var allInfo = {
                title: result[0].title,
                date: result[0].date,
                startTime: result[0].startTime,
                endTime: result[0].endTime,
                meetingPoint: result[0].meetingPoint,
                description: result[0].description,
                imagenames: getImages(id),
                musicTracks: getMusic(id),
                youTube: getClip(id)
            }
            res.send(allInfo)
        }
    }
    )
})

function postImage(data) {
    var filename = data.filename;
    var caption = data.caption;
    var eventID = data.eventID;
    db.query("INSERT INTO images SET filename = ?, caption = ?, eventID = ?", [filename, caption, eventID], (err: any, result: any) => {
            if(err) {
            console.log(err)
        } else {
            //retrive the imageID of the last inserted image
            db.query("SELECT LAST_INSERT_ID()", (err: any, result: any) => {
                if(err) {
                    console.log(err)
                } else {
                    //add the imageID to the data object and send it to the client
                    data.imageID = result[0];

                    return data
                }
            })
        }
    })
}

function postMusic(data) {
    db.query("INSERT INTO music SET ?", data, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            return "Values Inserted"
        }
    })
}

function postClip(data) {
    db.query("INSERT INTO clip SET ?", data, (err) => {
        if(err) {
            console.log(err)
        } else {
            // send a status message to the client
        return "Values Inserted"
        }
    }
    )
}
// get all images for an event
function getImages(id) {
    db.query("SELECT * FROM images WHERE eventID = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            return result
        }
    })
}

        

// get all music for an event
function getMusic(id) {
    db.query("SELECT * FROM music WHERE eventID = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            return result
        }
    }
    )
}



// get a defined number of images
app.get('/images/:noReq', (req, res) => {
    var noReq = req.params.noReq;
    db.query("SELECT DISTINCT * FROM images order by RAND() LIMIT "+noReq, (err: any, result: any) => {
        if(err) {
            console.log(err) 
        } else {
            //console.log(result)
            res.send(result)
        }
    })
})
// one of the functions is not closed properly  this is most likeley the getImages function

// save image data
app.post('/imagesPOST', (req, res) => {
    const data = req.body;
    db.query("INSERT INTO images SET ?", data, (err: any, res) => {
        if(err) {
            console.log(err)
        } else {
            // get the imageID of the last inserted image
            db.query("SELECT LAST_INSERT_ID()", (err: any, result: any) => {
                if(err) {
                    console.log(err)
                } else {
                    let imageID = result[0];
                    res.json({ imageID: imageID });
                }
            })
        }
    })
})

// delete image entry
app.delete('/images/:id', (req, res) => {
    const id = req.params.id;
    //console.log("*************************id : "+id)
    //retrieve the filename of the image
    db.query("SELECT filename, eventID FROM images WHERE imageID = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            if (result.length > 0) {
            let filename = result[0].filename;
            let eventID = result[0].eventID;
            deleteImageRecord(id)
            if (eventID === 0) {
                removeImageFile("./public/images/"+filename)
             } else {
                removeImageFile("./public/images/mobile/"+filename)
            }
            //delete the image file
            res.send("Value Deleted")
        }
        }
    })
}
)

function removeImageFile(filename) {
    fs.unlink(filename, (err) => {
        if(err) {
            console.log(err)
        } else {
            return {status: "File Deleted"}
        }
    })
}

function deleteImageRecord(id) {
    db.query("DELETE FROM images WHERE imageID = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            return {status: "Value Deleted"}
        }
    })
}
// update image entry
app.put('/imagesPUT', (req, res) => {
    const imageID = req.body.imageID;
    const title = req.body.title;
    const description = req.body.caption;
    const eventID = req.body.eventID;

    //// imageID, filename, caption, eventID
    db.query("UPDATE images SET filename = ?, caption = ?, eventID = ? WHERE imageID = ?", [title, description, id], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

app.get('/imagesEvent/:id', (req, res) => {
    
    const id = req.params.id;
    if (id <= 0) {
        db.query("SELECT * FROM images WHERE eventID <1", (err: any, result: any) => {
            if(err) {
                console.log(err)
            } else {
                res.send(result)
            }
        })
    } else {    
    db.query("SELECT * FROM images WHERE eventID = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
}
})


//music table structure
//musicTrackID, trackName, lyrics, soprano, alto, tenor, allParts

// get all of the music data
app.get('/music', (req, res) => {
    db.query("SELECT * FROM music", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/musicPOST', (req, res) => {
    const data = req.body;
    db.query("INSERT INTO music SET ?", data, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    })
})

app.delete('/musicDELETE/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM music WHERE id = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Deleted")
        }
    })
})

// update music entry
app.put('/musicPUT', (req, res) => {
    const id = req.body.id;
    const
    title = req.body.title;
    const description = req.body.description;
    db.query("UPDATE music SET trackName=? lyrics=? soprano=? alto=? tenor=? allParts=? WHERE id = ?", [title, description, id], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

// get the songlist for an event
app.get('/songlist/:id', (req, res) => {
    db.query("SELECT * FROM songlist", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
// get the app to listen to the port defined in the .env file
app.listen(process.env.PORT, () => {
    console.log("Server is running")
})

// get all of the upcoming events on or after the current date
app.get('/upcomingEvents', (req, res) => {
    db.query("SELECT * FROM choirevents WHERE eventDate >= CURDATE() order by eventDate", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

