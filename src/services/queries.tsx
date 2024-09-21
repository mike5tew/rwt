require('dotenv').config(__dirname + '/.env')
import exp from "constants";
import { EmptyEventDetails, EmptyArchiveEntry, EventDetails, ArchiveEntry, Clip, EmptyClip, ImageDetail, EmptyImageDetail, Message,  User, PlaylistEntry, EmptyMusicTrack, EmptyPlaylistEntry, MusicTrack, SiteInfo } from "../types/types"; 
//const express = require('express');
const db = require('./config/db');
// on the server the upload folder is in the public folder
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const app = express();
import express, {Request, Response} from 'express';


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
    new Promise<string>((resolve, reject) => {

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
    new Promise<string>((resolve, reject) => {
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
    new Promise<ArchiveEntry[]>((resolve, reject) => {

    let archs: ArchiveEntry[] = [];
    // create a promise to get the archive data that returns an array of archive objects
    
    var archivesRequired = req
// make sure that the archivesRequired is a number
// create a promise to get the archive data
    db.query("SELECT archive.archiveID, choirevents.location, choirevents.eventDate, choirevents.title, archive.report, archive.eventID FROM choirevents join archive on archive.eventID=choirevents.eventID order by choirevents.eventDate LIMIT ?;", archivesRequired, (err: any, result: any) => {
        if(err) {
            reject("scadC "+err.message)
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
            resolve(archs)
        }
    )}
).then((archives) => {   
   // console.log(archives)
    var events: number[] = []
    for (var i = 0; i < archives.length; i++) {
        events = [...events, archives[i].eventDetails.eventID]
    }
   // console.log(events)
        // set up a promise to get all of the images and pass the array of events to the promise
    let imagesPromise = new Promise<ImageDetail[]>((resolve, reject) => {
        db.query("SELECT * FROM images WHERE eventID = ?", events, (err: any, result: any) => {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                let images: ImageDetail[] = []
                for (var i = 0; i < result.length; i++) {
                    var image = EmptyImageDetail();
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

    const clipsPromise = new Promise<Clip[]>((resolve, reject) => {   
        db.query("SELECT * FROM clips WHERE eventID = ?", events, (err: any, result: any) => {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                var clips: Clip[] = []
                for (var i = 0; i < result.length; i++) {
                    var clip:Clip = EmptyClip();
                        clip.id= result[i].clipID,
                        clip.clipURL= result[i].clipURL,
                        clip.eventID= result[i].eventID,
                        clip.caption= result[i].caption
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
        let images: ImageDetail[] = values[0];
        var clips: Clip[] = values[1];
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
}

// the getArchive function is not defined in the code above

export function messages(req: any, res: any) {
new Promise<Message>((resolve, reject) => {
    // app.get('/messages', (req, res) => {
    db.query("SELECT * FROM messages", (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            resolve(res.send(result))
        }
    })
})

// messageID, messageDate, messageFrom, messageContent
export function messagesPOST(req: any, res: any) {
    new Promise<Message>((resolve, reject) => {
        // app.get('/messages', (req, res) => {
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

export function messagesDELETE(req: any, res: any) {
    new Promise<Message>((resolve, reject) => {
    const id = req.params.id;
    db.query("DELETE FROM messages WHERE messageID = ?", id, (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            resolve(res.send("Value Deleted"))
        }
    })
})


// This section is the username and password section.  We obviously want this section to be secure
// and so we need to use a secure method to store the username and password
// the usernames and passwords are stored in the .env file and are accessed using the process.env object
// the .env file is not included in the repository and so the username and password are not available to the public

export function login(req: any, res: any) {
new Promise<string>((resolve, reject) => {
//app.post('/login', (req, res) => {
    console.log(req.body)
    let loginUser: User = JSON.parse(req.body);
    // retrieve the users array from the .env file
    // users is a json object and so we need to parse the json object to get the array
    if (process.env.users == undefined) {
        process.env.users = "[]"
    }
    let users: User[] = JSON.parse(process.env.users)    
    console.log(users) 
    console.log(users.length)

    for (let i = 0; i < users.length; i++) {
        if (loginUser.username === users[i].username && loginUser.password === users[i].password && loginUser.role === users[i].role) {
            // return staus 200 if the login is successful
            res.status(200).send({message: "Updated post successfuly"})
            return
        }
    }
    res.status(401).send({message: "Login failed"})

}
)

export function loginAddUser(req: any, res: any) {
new Promise<string>((resolve, reject) => {
    //app.post('/loginAddUser', (req, res) => {
    // add the username and password to the .env file
    process.env.users += "{ username: "+req.body.username+", password:"+ req.body.password+", role:" + req.body.role +"}]"
    resolve(res.send("User Added"))
})


export function loginDeleteUser(req: any, res: any) {
    new Promise<string>((resolve, reject) => {
// app.post('/loginDeleteUser', (req, res) => {
    // delete the username and password from the .env file
    let users: User[]
    if (process.env.users == undefined) {
        process.env.users = "[]"
    } else {
    users = JSON.parse(process.env.users)
    users = users.filter(user => user.username !== req.body.username)
    process.env.users = JSON.stringify(users)
    resolve("User Deleted")
    }
}
)



export function upcomingPlaylists() {
    new Promise<PlaylistEntry[]>((resolve, reject) => {
        var events: EventDetails[] = []
        var pList: PlaylistEntry[] = []
        var event: EventDetails = EmptyEventDetails();
//app.get('/upcomingPlaylists', (req, res) => {
    db.query("SELECT choirevents.eventID, choirevents.location, choirevents.eventDate, choirevents.startTime, choirevents.endTime, choirevents.title, choirevents.meetingPoint, playlists.playlistID, playlists.musicID, playlists.playorder, music.musicTrackID, music.trackName, music.artist, music.lyrics, music.soprano, music.alto, music.tenor, music.allParts FROM choirevents LEFT OUTER JOIN (playlists JOIN music on playlists.musicID=music.musicTrackID) on choirevents.eventID=playlists.eventID where choirevents.eventDate>= curdate() order by choirevents.eventDate, playlists.playorder")
    .then((result: any) => {
        var id: number = 0
        var len = result.length;
        for (var i = 0; i < len; i++) {
            if (result[i].eventID != id) {
                 event = EmptyEventDetails();
                 
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
            var mTrack:MusicTrack = EmptyMusicTrack();
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
    .catch((err: any) => {
        console.log(err)
        res.send("No events found")
    })
})



// const EventDetails = {
//     eventID: 0,
//     location: "",
//     eventDate: "",
//     startTime: "",
//     endTime: "",
//     price: 0,
//     title: "",
//     playlist: []
// }
// function EmptyEventDetails() {
//     return {
//         eventID: 0,
//         location: "",
//         eventDate: "",
//         startTime: "",
//         endTime: "",
//         price: 0,
//         title: "",
//         playlist: []
//     }
// }
// function emptyArchiveEntry() {
//     return {
//         archiveID: 0,
//         report: "",
//         images: [],
//         clips: []
//     }
// }
export function eventArchive(id: number) {
// app.get('/eventarchive/:id', (req, res) => {
    // const id = req.par


    // we want the archive function to act as a promise so that we can use the data in the function
    // we need to use the .then() method to get the data from the function by using the syuntax 
let archivePromise = new Promise<ArchiveEntry>((resolve, reject) => { 
    var archive: ArchiveEntry = EmptyArchiveEntry();
    // console.log("id : "+id)
    
     db.query("SELECT archive.archiveID, choirevents.location, choirevents.eventDate, choirevents.title, archive.report FROM choirevents join archive on archive.eventID=choirevents.eventID WHERE archive.eventID= ? ", id, (err: any, result: any) => {
        if(err) {
            reject(err)
        } else {
            // create an archive object

            var archive: ArchiveEntry = EmptyArchiveEntry();
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
 
let imagesPromise = new Promise<ImageDetail[]>((resolve, reject) => {
    db.query("SELECT * FROM images WHERE eventID = ?", id, (err: any, result: any) => {
        if(err) {
            reject(err)
        } else {
            var images: ImageDetail[] = []
            for (var i = 0; i < result.length; i++) {
                var image: ImageDetail = EmptyImageDetail();
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

let clipsPromise = new Promise<Clip[]>((resolve, reject) => {
    db.query("SELECT * FROM clips WHERE eventID = ?", id, (err: any, result: any) => {
        if(err) {
            reject(err)
        } else {
            var clips: Clip[] = []
            for (var i = 0; i < result.length; i++) {
                var clip: Clip = EmptyClip();
                    clip.id= result[i].clipID,
                    clip.clipURL= result[i].clipURL,
                    clip.eventID= result[i].eventID,
                    clip.caption= result[i].caption

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
}
)
}

export function themeDetails() {
    
    new Promise<string>((resolve, reject) => {
    db.query("SELECT * FROM themedetails", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

//themeDetails, boxColour, textColour, textFont, backgroundImage, textboxColour, logoimage, bannerColour, menuColour, buttonColour, buttonHover, buttonTextColour, menuTextColour
export function themeDetailsPUT() {
    new Promise<string>((resolve, reject) => {
// app.put('/themedetailsPUT', (req, res) => {
    const data = req.body;
    db.query("UPDATE themedetails SET boxColour = ?, textColour = ?, textFont = ?, backgroundImage = ?, textboxColour = ?, logoimage = ?, bannerColour = ?, menuColour = ?, buttonColour = ?, buttonHover = ?, buttonTextColour = ?, menuTextColour = ?, textSize = ?", [data.boxColour, data.textColour, data.textFont, data.backgroundImage, data.textboxColour, data.logoimage, data.bannerColour, data.menuColour, data.buttonColour, data.buttonHover, data.buttonTextColour, data.menuTextColour, data.textSize], (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            resolve("Values Updated")
        }
    })
})

// create an SQL statement updating the colour value of the themeDetails table to random colors with the textfont being impact and the logoimage being the choir logo
export function themeDetailsRandom() {
    new Promise<string>((resolve, reject) => {
// app.get('/themedetailsRandom', (req, res) => {
    // create an array of colours
    let data = {
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
            reject(console.log(err))
        } else {
            resolve("Values Updated")
        }
    })
})

// get music list
//musicTrackID, trackName, lyrics, soprano, alto, tenor, allParts
export function musicList() {
    new Promise<MusicTrack>((resolve, reject) => {
// app.get('/trackList', (req, res) => {
    db.query("SELECT musicTrackID, trackName, artist FROM music", (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            let musicTrack:MusicTrack = EmptyMusicTrack();
            for(var i = 0; i < result.length; i++) {
                musicTrack.musicTrackID = result[i].musicTrackID;
                musicTrack.trackName = result[i].trackName;
                musicTrack.artist = result[i].artist;
            }
            resolve(musicTrack)
        }
    })
})

// export function archive() {
//     new Promise<ArchiveEntry>((resolve, reject) => {
//             // app.get('/archive', (req, res) => {
//     db.query("SELECT * FROM archive", (err: any, result: any) => {
//         if(err) {
//             reject(console.log(err))
//         } else {
//             // we need to send the result to the client as a json object

//             res.send(result)
//         }
//     })
// })

// save archive data
export function archivePOST(arch: ArchiveEntry) {
    new Promise<string>((resolve, reject) => {
// app.post('/archivePOST', (req, res) => {
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
                        reject(console.log(err))
                    } else {
                        uploadClips(data.clips)
                        resolve("Value Updated")
                    }
                })
            } else {
                // if there is no entry with the same eventID then insert a new entry
                db.query("INSERT INTO archive  (report, eventID) VALUES (?,?)", [data.report, data.eventID], (err: any, result: any) => {
                    if(err) {
                        reject(console.log(err))
                    } else {
                        uploadClips(data.clips)
                        resolve("Values Inserted")
                    }
                })
            }
        }
    })

})

function uploadClips(clips: Clip[]) {
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
export function archiveDELETE(id: number) {
    new Promise<string>((resolve, reject) => {
// app.delete('/archiveDELETE/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM archive WHERE id = ?", id, (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            resolve("Value Deleted")
        }
    })
})

// update archive entry
export function archivePUT(arch: ArchiveEntry) {
    new Promise<string>((resolve, reject) => {
// app.put('/archivePUT', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const description = req.body.description;
    db.query("UPDATE archive SET title = ?, description = ? WHERE id = ?", [title, description, id], (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            resolve("Value Updated")
        }
    })
})

// get a playlist for an event
export function playlist(id: number) {
    new Promise<PlaylistEntry[]>((resolve, reject) => {
// app.get('/playlists/:id', (req, res) => {
    const id = req.params.id;
    db.query("SELECT playlistID, playorder, musicTrackID, trackName, artist from playlists join music on playlists.musicID=music.musicTrackID WHERE playlists.eventID=? order by playorder", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            //console.log(result)
            let playlist: PlaylistEntry[] = []
            for(var i = 0; i < result.length; i++) {
                var playlistEntry: PlaylistEntry = EmptyPlaylistEntry();
                playlistEntry.id = i;
                playlistEntry.playlistID = result[i].playlistID;
                playlistEntry.playorder = result[i].playorder;
                playlistEntry.eventID = id;
                var musicTrack: MusicTrack = EmptyMusicTrack();
                musicTrack.musicTrackID = result[i].musicTrackID;
                musicTrack.trackName = result[i].trackName;
                musicTrack.artist = result[i].artist;
                playlistEntry.musicTrack = musicTrack;
                playlist = [...playlist, playlistEntry]
            }
            res.send(playlist)
        }
    })
})

// save playlist data
export function playlistsPOST(data: PlaylistEntry[]) {
    new Promise<string>((resolve, reject) => {
// app.post('/playlistsPOST', (req, res) => {
    // convert the data to a json object.  The data is sent as an array of playlistEntry objects
    const data = req.body;
    // find the eventID from the first entry in the array
    const eventID = data[0].eventID;
    // delete all of the existing playlist entries for the event
    db.query("DELETE FROM playlists WHERE eventID = ?", eventID, (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        }
    })
    for(var i = 0; i < data.length; i++) {
        db.query("INSERT INTO playlists (eventID, musicID, playorder) VALUES (?, ?, ?)", [data[i].eventID, data[i].musicTrack.musicTrackID, data[i].playorder], (err: any, result: any) => {
            if(err) {
                reject(console.log(err))
            } else {
                resolve("Values Inserted")
            }
        })
    }
})


//event table structure
//eventID, location, eventDate, startTime, endTime, price, title


const events = (id: number): Promise<EventDetails[]> => {
    return new Promise<EventDetails[]>((resolve, reject) => {
        let sQuery: string
if (id == -1) {
    sQuery = "SELECT * FROM choirevents"
} else {
    sQuery = "SELECT * FROM choirevents WHERE eventID = " + id
}
    db.query(sQuery, (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            // load the results into an array of eventDetails
            let events: EventDetails[] = []
            for(var i = 0; i < result.length; i++) {
                var event: EventDetails = EmptyEventDetails();
                event.eventID = result[i].eventID;
                event.location = result[i].location;
                event.eventDate = result[i].eventDate;
                event.startTime = result[i].startTime;
                event.endTime = result[i].endTime;
                event.price = result[i].price;
                event.title = result[i].title;
                events = [...events, event]
            }
            resolve(events)
        }
    })
    .catch((err: any) => {
        console.log(err);
        return Promise.reject<ArchiveEntry>(err); // Return a rejected promise with the error
      });
})

const playlist = (id: number): Promise<PlaylistEntry[]> => {
    return new Promise<PlaylistEntry[]>((resolve, reject) => {
        var sQuery: string
        if (id == -1) {
            sQuery = "SELECT * FROM playlists"
        } else {
            sQuery = "SELECT * FROM playlists WHERE eventID = " + id
        }
        db.query(sQuery, (err: any, result: any) => {
            if(err) {
                reject(console.log(err))
            } else {
                let playlist: PlaylistEntry[] = []
                for(var i = 0; i < result.length; i++) {
                    var playlistEntry: PlaylistEntry = EmptyPlaylistEntry();
                    playlistEntry.playlistID = result[i].playlistID;
                    playlistEntry.playorder = result[i].playorder;
                    playlistEntry.eventID = result[i].eventID;
                    playlistEntry.musicTrack = result[i].musicID;
                    playlist = [...playlist, playlistEntry]
                }
                resolve(playlist)
            }
        })
    }
    )
}

const images = (id: number): Promise<ImageDetail[]> => {
    return new Promise<ImageDetail[]>((resolve, reject) => {
        db.query("SELECT * FROM images WHERE eventID = ?", id, (err: any, result: any) => {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                let images: ImageDetail[] = []
                for (var i = 0; i < result.length; i++) {
                    var image = EmptyImageDetail();
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
    }
    )
}

const clips = (id: number): Promise<Clip[]> => {
    return new Promise<Clip[]>((resolve, reject) => {
        db.query("SELECT * FROM clips WHERE eventID = ?", id, (err: any, result: any) => {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                var clips: Clip[] = []
                for (var i = 0; i < result.length; i++) {
                    var clip:Clip = EmptyClip();
                        clip.id= result[i].clipID,
                        clip.clipURL= result[i].clipURL,
                        clip.eventID= result[i].eventID,
                        clip.caption= result[i].caption
                    clips = [...clips, clip]
                }
                resolve(clips)
            }
        }
        ).catch((err: any) => {
                console.log(err);
                return Promise.reject<Clip[]>(err); // Return a rejected promise with the error
              });
    }
    )
} 

// we need to use the Promise.all() method to get the data from the promises
export function eventComplete(id: number): Promise<EventDetails[]> {
    return Promise.all([events(id), playlist(id)])
    .then((values) => {
        let events: EventDetails[] = values[0];
        let playlist: PlaylistEntry[] = values[1];
        for (var i = 0; i < events.length; i++) {
            for (var j = 0; j < playlist.length; j++) {
                if (events[i].eventID == playlist[j].eventID) {
                    events[i].playlist = [...events[i].playlist, playlist[j]]
                }
            }
        }
        return events
    }
    )
    .catch((err) => {
        console.log(err)
        return []
    }
    )
}

// save event data
export function eventsPOST(data: EventDetails) {
    new Promise<string>((resolve, reject) => {
//app.post('/eventPOST', (req, res) => {
    // the event data is sent as an eventDetails json object. So we need to extract the data from the object
    // create a new eventDetails object and load the data into it
   // console.log(req.body)
    var location = data.location;
    var invitation = data.invitation;
    var eventDate = data.eventDate;
    var startTime = data.startTime;
    var endTime = data.endTime;
    var meetingPoint = data.meetingPoint;
    var price = data.price;
    var title = data.title;

    db.query("INSERT INTO choirevents SET location = ?, eventDate = ?, startTime = ?, endTime = ?, price = ?, title = ?, invitation = ?, meetingPoint = ? ", [location, eventDate, startTime, endTime, price, title, invitation, meetingPoint], (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            resolve("Values Inserted")
        }
    })
})

// delete event entry

export function eventsDELETE(id: number) {
    new Promise<string>((resolve, reject) => {
//app.delete('/eventDELETE/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM event WHERE id = ?", id, (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            resolve("Value Deleted")
        }
    })
})

// update event entry
export function eventsPUT(data: EventDetails) {
    new Promise<string>((resolve, reject) => {
// app.put('/eventPUT', (req, res) => {
    var location = data.location;
    var eventDate = data.eventDate;
    var startTime = data.startTime;
    var endTime = data.endTime;
    var price = data.price;
    var title = data.title;
    db.query("UPDATE event SET location = ?, eventDate = ?, startTime = ?, endTime = ?, price = ?, title = ? WHERE id = ?", [location, eventDate, startTime, endTime, price, title], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
})

export function siteinfo() {
    new Promise<string>((resolve, reject) => {
//app.get('/siteinfo', (req, res) => {
    db.query("SELECT * FROM siteinfo", (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})


//id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText
export function siteinfoPUT(data: SiteInfo) {
    new Promise<string>((resolve, reject) => {
// app.post('/siteinfoPUT', (req, res) => {
    const data = req.body;
    //console.log(req.body)
    db.query("UPDATE siteinfo SET HomeTitle = ?, HomeText = ?, AboutTitle = ?, AboutText = ?, ArchiveTitle = ?, ArchiveText = ?, NoticesTitle = ?, NoticesText = ?, BookingTitle = ?, BookingText = ?, MembersTitle = ?, MembersText = ?, AppealTitle = ?, AppealText = ?, SettingsTitle = ?, SettingsText = ? ", [data.titleHome, data.descriptionHome, data.titleAbout, data.descriptionAbout, data.titleArchive, data.descriptionArchive, data.titleNotices, data.descriptionNotices, data.titleBooking, data.descriptionBooking, data.titleMembers, data.descriptionMembers, data.titleAppeal, data.descriptionAppeal, data.titleSettings, data.descriptionSettings], (err: any, result: any) => {
        if(err) {
            reject(console.log(err))
        } else {
            resolve("Values Updated")
        }
    })
})

//eventID, location, eventDate, startTime, endTime, price, title, meetingPoint, invitation
//musicTrackID, trackName, artist, lyrics, soprano, alto, tenor, allParts, piano



const EventBasics = (id: number): Promise<EventDetails[]> => {
    return new Promise<EventDetails[]>((resolve, reject) => {
    var sQuery = "SELECT eventID, location, eventDate, startTime, endTime, price, title, meetingPoint, invitation, musictrackID, trackName, artist, lyrics, soprano, alto, tenor, allParts, piano FROM choirevents LEFT OUTER JOIN music ON choirevents.eventID = music.eventID"
    if (id != -1) {
        sQuery += " WHERE eventID = " + id
    }
      db.query(sQuery, id, (err: any, result: any[]) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
            //convert the result into an array of EventDetails objects (containing the playlist)
            var events: EventDetails[] = []
            var event: EventDetails = EmptyEventDetails();
            for (var i = 0; i < result.length; i++) {
                if (result[i].eventID != event.eventID) {
                    event = EmptyEventDetails();
                    event.eventID = result[i].eventID;
                    event.location = result[i].location;
                    event.eventDate = result[i].eventDate;
                    event.startTime = result[i].startTime;
                    event.endTime = result[i].endTime;
                    event.price = result[i].price;
                    event.title = result[i].title;
                    event.meetingPoint = result[i].meetingPoint;
                    event.invitation = result[i].invitation;
                    event.playlist = []
                }
                var plEntry = EmptyPlaylistEntry();
                plEntry.playlistID = result[i].playlistID;
                var mTrack: MusicTrack = EmptyMusicTrack();
                mTrack.musicTrackID = result[i].musicTrackID;
                mTrack.trackName = result[i].trackName;
                mTrack.artist = result[i].artist;
                mTrack.lyrics = result[i].lyrics;
                mTrack.soprano = result[i].soprano;
                mTrack.alto = result[i].alto;
                mTrack.tenor = result[i].tenor;
                mTrack.allParts = result[i].allParts;
                mTrack.piano = result[i].piano;
                plEntry.musicTrack = mTrack;
                event.playlist = [...event.playlist, plEntry]
                events = [...events, event]
            }

            resolve(events)
            }
        }
    )
    }
    )
}


//musicTrackID, trackName, artist, lyrics, soprano, alto, tenor, allParts, piano

const Music = (id: number): Promise<MusicTrack[]> => {
    return new Promise<MusicTrack[]>((resolve, reject) => {
        var sQuery: string
        if (id == -1) {
            sQuery = "SELECT * FROM music"
        } else {
            sQuery = "SELECT * FROM music WHERE eventID = " + id
        }  
        db.query(sQuery, (err: any, result: MusicTrack[]) => {
            if (err) {
            console.log(err);
            reject(err);
            } else {
                var music: MusicTrack[] = []
                for (var i = 0; i < result.length; i++) {
                    var mTrack: MusicTrack = EmptyMusicTrack();
                    mTrack.musicTrackID = result[i].musicTrackID;
                    mTrack.trackName = result[i].trackName;
                    mTrack.artist = result[i].artist;
                    mTrack.lyrics = result[i].lyrics;
                    mTrack.soprano = result[i].soprano;
                    mTrack.alto = result[i].alto;
                    mTrack.tenor = result[i].tenor;
                    mTrack.allParts = result[i].allParts;
                    mTrack.piano = result[i].piano;
                    music = [...music, mTrack]
                }
                resolve(music)
            }
        }
    )
    }
    )
}


//imageID, filename, caption, eventID, height, width
    const ImageDetail = (id: number): Promise<ImageDetail[]> => {
        return new Promise<ImageDetail[]>((resolve, reject) => {
        db.query("SELECT * FROM images WHERE eventID = ?", id, (err: any, result: ImageDetail[]) => {
            if (err) {
            console.log(err);
            reject(err);
            } else {
            var images: ImageDetail[] = []
            for (var i = 0; i < result.length; i++) {
                var image: ImageDetail = EmptyImageDetail();
                image.imageID = result[i].imageID;
                image.filename = result[i].filename;
                image.caption = result[i].caption;
                image.eventID = result[i].eventID;
                images = [...images, image]
            }
            resolve(images)
            }
        });
        });
    };

    const Clip = (id: number): Promise<Clip[]> => {
        return new Promise<Clip[]>((resolve, reject) => {
        db.query("SELECT * FROM clips WHERE eventID = ?", id, (err: any, result: Clip[]) => {
            if (err) {
            console.log(err);
            reject(err);
            } else {
            resolve(result);
            }
        });
        });
    };
    const ArchiveBasics = (id: number): Promise<ArchiveEntry> => {
        return new Promise<ArchiveEntry>((resolve, reject) => {
          db.query("SELECT * FROM archive WHERE archiveID = ?", id, (err: any, result: ArchiveEntry[]) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const archive: ArchiveEntry = result[0];
              resolve(archive);
            }
          });
        });
      }

    export function ArchiveDetail(id: number): Promise<ArchiveEntry> {
        return Promise.all([ArchiveBasics(id), EventBasics(id), ImageDetail(id), Clip(id)])
          .then((values) => {
            const arch: ArchiveEntry = values[0];
            arch.eventDetails = values[1][0];
            arch.images = values[2];
            arch.clips = values[3];
            return Promise.resolve<ArchiveEntry>(arch);
          })
          .catch((err) => {
            console.log(err);
            return Promise.reject<ArchiveEntry>(err); // Return a rejected promise with the error
          });
      }





export function postImage(data: ImageDetail) {
    new Promise<ImageDetail>((resolve, reject) => {
//function postImage(data) {
    var filename = data.filename;
    var caption = data.caption;
    var eventID = data.eventID;
    db.query("INSERT INTO images SET filename = ?, caption = ?, eventID = ?", [filename, caption, eventID], (err: any, result: any) => {
            if(err) {
            reject(console.log(err))
        } else {
            //retrive the imageID of the last inserted image
            db.query("SELECT LAST_INSERT_ID()", (err: any, result: any) => {
                if(err) {
                    reject(console.log(err))
                } else {
                    //add the imageID to the data object and send it to the client
                    data.imageID = result[0];
                    resolve(data)
                }
            }
            )
        }
    }
    )
}

export function postMusic(data: MusicTrack, res: Response) {
    db.query("INSERT INTO music SET ?", data, (err: any, result: any) => {
        if(err) {
            res.status(500).send("Error inserting music");
        } else {
            res.send("Values Inserted")
        }
    }
    )
}


export function postClip(data: Clip) {
//function postClip(data) {
    db.query("INSERT INTO clip SET ?", data, (err: any, result: any) => {
        if(err) {
            console.log(err)
            res.status(500).send("Error inserting clip");
        } else {
            // send a status message to the client
            res.send("Values Inserted")
        }
    }
    )
}

// save image data
export function imagesPOST(data: ImageDetail, res: Response) {
    db.query("INSERT INTO images SET ?", data, (err: any) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error inserting image");
      } else {
        db.query("SELECT LAST_INSERT_ID()", (err: any, result: number[]) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error getting image ID");
          } else {
            const imageID = result[0];
            res.json({ imageID: imageID });
          }
        });
      }
    });
  }  
// delete image entry
export function imagesDELETE(id: number) {
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


function removeImageFile(filename: string) {
    fs.unlink(filename, (err:any ) => {
        if(err) {
            console.log(err)
        } else {
            return {status: "File Deleted"}
        }
    })
}

function deleteImageRecord(id: number) {
    db.query("DELETE FROM images WHERE imageID = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            return {status: "Value Deleted"}
        }
    })
}
// update image entry
export function imagesPUT(data: ImageDetail) {
    const imageID = data.imageID;
    const title = data.filename;
    const description = data.caption;
    const eventID = data.eventID;

    //// imageID, filename, caption, eventID
    db.query("UPDATE images SET filename = ?, caption = ?, eventID = ? WHERE imageID = ?", [title, description, id], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Value Updated")
        }
    })
}



// get the music list
export function musicListPOST(data: MusicTrack) {
    db.query("INSERT INTO music SET ?", data, (err: any, result: any) => {
        if(err) {
            console.log(err)
            res.status(500).send("Error inserting music"); 
        } else {
            res.send("Values Inserted")
        }
    })
}

export function musicListDELETE(id: number) {
    db.query("DELETE FROM music WHERE id = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
            res.status(500).send("Error deleting music");
        } else {
            res.send("Value Deleted")
        }
    })
}

// update music entry
export function musicListPUT(data: MusicTrack) {
    db.query("UPDATE music SET trackName=? lyrics=? soprano=? alto=? tenor=? allParts=? WHERE musicTrackID = ?", [data.trackName, data.lyrics, data.soprano, data.alto, data.tenor, data.allParts, data.musicTrackID], (err: any, result: any) => {
        if(err) {
            console.log(err)
            res.status(500).send("Error updating music");
        } else {
            res.send("Music Updated")
        }
    }
    )
}


