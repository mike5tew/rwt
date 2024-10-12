// import exp from "constants";
import { EmptyEventDetails, EmptyArchiveEntry, EventDetails, ArchiveEntry, Clip, EmptyClip, ImageDetail, EmptyImageDetail, Message,  User, PlaylistEntry, EmptyMusicTrack, EmptyPlaylistEntry, MusicTrack, SiteInfo, EmptySiteInfo, ThemeDetails, EmptyThemeDetails } from "../types/types.d"; 
import db from '../services/db';
import cors from 'cors';
import path from 'path';
import express, {Response} from 'express';
// const fs = require('browserify-fs');
require('dotenv').config(__dirname + '/.env')
const app = express();


app.use(cors());
app.use(express.json())
// import the pool from the db.js file
// an error is thrown because the path module is not defined
// the path module is a core module in node.js so it should be available
// import { arch } from 'os';
// import { get } from 'http';
app.use(express.static(path.join(__dirname, 'public/')));

// create an upload object
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
            db.query("SELECT LAST_INSERT_ID() from images", (err: any, result: any) => {
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
}



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
}


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
}


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
                    var clp:Clip = EmptyClip();
                        clp.id= result[i].clipID,
                        clp.clipURL= result[i].clipURL,
                        clp.eventID= result[i].eventID,
                        clp.caption= result[i].caption
                    clips = [...clips, clp]
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
}



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
}


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
}

export function loginAddUser(req: any, res: any) {
new Promise<string>((resolve, reject) => {
    //app.post('/loginAddUser', (req, res) => {
    // add the username and password to the .env file
    process.env.users += "{ username: "+req.body.username+", password:"+ req.body.password+", role:" + req.body.role +"}]"
    resolve(res.send("User Added"))
})
}

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
}



export function upcomingPlaylists() {
        var events: EventDetails[] = []
        var pList: PlaylistEntry[] = []
        var event: EventDetails = EmptyEventDetails();
    db.query("SELECT choirevents.eventID, choirevents.location, choirevents.eventDate, choirevents.startTime, choirevents.endTime, choirevents.title, choirevents.meetingPoint, playlists.playlistID, playlists.musicID, playlists.playorder, music.musicTrackID, music.trackName, music.artist, music.lyrics, music.soprano, music.alto, music.tenor, music.allParts FROM choirevents LEFT OUTER JOIN (playlists JOIN music on playlists.musicID=music.musicTrackID) on choirevents.eventID=playlists.eventID where choirevents.eventDate>= curdate() order by choirevents.eventDate, playlists.playorder", (err: any, result: any) => {
        if (err) {
            console.log(err)
            result.send("Error")
        } else {
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
        result.send(events)
    }
    }
    )
    }

// return an archive entry from the eventID
export function eventArchive(id: number): Promise<ArchiveEntry> {
    return new Promise<ArchiveEntry>((resolve, reject) => {
        db.query("SELECT archive.archiveID, choirevents.location, choirevents.eventDate, choirevents.title, archive.report FROM choirevents join archive on archive.eventID=choirevents.eventID WHERE archive.eventID= ? ", id, (err: any, result: any) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                var archive: ArchiveEntry = EmptyArchiveEntry();
                for (var i = 0; i < result.length; i++) {
                    archive.archiveID = result[i].archiveID;
                    archive.report = result[i].report;
                    archive.eventDetails.eventID = result[i].eventID;
                    archive.eventDetails.location = result[i].location;
                    archive.eventDetails.eventDate = result[i].eventDate;
                }
                resolve(archive);
            }
        });
    });
}

//imageID, filename, caption, eventID, height, width
export const ImagesFromEvent = (id: number): Promise<ImageDetail[]> => {
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

const clipsFromEvent = (id: number): Promise<Clip[]> => {
    return new Promise<Clip[]>((resolve, reject) => {
        db.query("SELECT * FROM clips WHERE eventID = ?", id, (err: any, result: any) => {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                var clips: Clip[] = []
                for (var i = 0; i < result.length; i++) {
                    var clp:Clip = EmptyClip();
                        clp.id= result[i].clipID,
                        clp.clipURL= result[i].clipURL,
                        clp.eventID= result[i].eventID,
                        clp.caption= result[i].caption
                    clips = [...clips, clp]
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

//gather an array of random imageDetails of a given length
export function randomImages(length: number): ImageDetail[] {
   return db.query("SELECT * FROM images ORDER BY RAND() LIMIT ?", length, (err: any, data: any) => {
        if (err) {
            console.log(err);
            return [];
        } else {
            let imagesTp: ImageDetail[] = [];
            for (let i = 0; i < data.length; i++) {
                var imgDetail = EmptyImageDetail();
                imgDetail.imageID = data[i].imageID;
                imgDetail.filename = data[i].filename;
                imgDetail.caption = data[i].caption;
                imgDetail.eventDetails.eventID = data[i].eventID;
                if (data[i].width > data[i].height) {
                    imgDetail.rows = 1;
                    imgDetail.cols = 2;
                } else {
                    imgDetail.rows = 2;
                    imgDetail.cols = 1;
                }
                imagesTp = [...imagesTp, imgDetail];
            }
            return imagesTp;
        }
    }
    );
}

export function ArchiveFromEvent(id: number): Promise<ArchiveEntry> {
    // Combining the information from three functions that return promises
    // we need to use the .then() method to get the data from the function by using the syuntax
    // we need to use the Promise.all() method to get the data from the promises
    return Promise.all([ArchiveFromEvent(id), ImagesFromEvent(id), clipsFromEvent(id)])
.then((values) => {
    let archive: ArchiveEntry = values[0];
    let images: ImageDetail[] = values[1];
    let clips: Clip[] = values[2];
    archive.images = images;
    archive.clips = clips;
    return archive
}
)
.catch((err) => {
    console.log(err)
    return EmptyArchiveEntry()
}
)
}

export function themeDetails() {
    return new Promise<ThemeDetails>((resolve, reject) => {       
    db.query("SELECT * FROM themedetails", (err: any, result: any) => {
        if(err) {
            console.log(err)
            reject(err)
        } else {
            let theme: ThemeDetails = EmptyThemeDetails();
            for(var i = 0; i < result.length; i++) {
                theme.boxColour = result[i].boxColour;
                theme.textColour = result[i].textColour;
                theme.textFont = result[i].textFont;
                theme.backgroundImage = result[i].backgroundImage;
                theme.textboxColour = result[i].textboxColour;
                theme.logoImage = result[i].logoimage;
                theme.bannerColour = result[i].bannerColour;
                theme.menuColour = result[i].menuColour;
                theme.buttonColour = result[i].buttonColour;
                theme.buttonHover = result[i].buttonHover;
                theme.buttonTextColour = result[i].buttonTextColour;
                theme.menuTextColour = result[i].menuTextColour;
                theme.textSize = result[i].textSize;
            }
            resolve(theme)
        }
    }
    )
}
)
}




//themeDetails, boxColour, textColour, textFont, backgroundImage, textboxColour, logoimage, bannerColour, menuColour, buttonColour, buttonHover, buttonTextColour, menuTextColour
export function themeDetailsPUT(data: ThemeDetails) {
    return new Promise<string>((resolve, reject) => {
// app.put('/themedetailsPUT', (req, res) => {
    db.query("UPDATE themedetails SET boxColour = ?, textColour = ?, textFont = ?, backgroundImage = ?, textboxColour = ?, logoimage = ?, bannerColour = ?, menuColour = ?, buttonColour = ?, buttonHover = ?, buttonTextColour = ?, menuTextColour = ?, textSize = ?", [data.boxColour, data.textColour, data.textFont, data.backgroundImage, data.textboxColour, data.logoImage, data.bannerColour, data.menuColour, data.buttonColour, data.buttonHover, data.buttonTextColour, data.menuTextColour, data.textSize], (err: any, result: any) => {
        if(err) {
            console.log(err)
            reject(err)
        }
        resolve("Values Updated")
    }
    )
}
)
}


// create an SQL statement updating the colour value of the themeDetails table to random colors with the textfont being impact and the logoimage being the choir logo
export function themeDetailsRandom() {
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
            console.log(err)
        } else {
            result.send("Values Updated")
        }
    })
}

// get music list
//musicTrackID, trackName, lyrics, soprano, alto, tenor, allParts
export function musicList() {
    return new Promise<MusicTrack[]>((resolve, reject) => {
// app.get('/trackList', (req, res) => {
    db.query("SELECT musicTrackID, trackName, artist FROM music", (err: any, result: any) => {
        if(err) {
            console.log(err)
            reject(err)
        } else {
            let musicL: MusicTrack[] = []
            for(var i = 0; i < result.length; i++) {
                let music: MusicTrack = EmptyMusicTrack();
                music.musicTrackID = result[i].musicTrackID;
                music.trackName = result[i].trackName;
                music.artist = result[i].artist;
                musicL = [...musicL, music]
            }
            resolve(musicL)
        }
    }
    )
}
)
}



export async function uploadClips(clips: Clip[]) {
  for (let clip of clips) {
    const isNewClip = clip.id === -1;
    try {
      if (isNewClip) {
        await db.query(
          "INSERT INTO clips (clipURL, eventID, caption) VALUES (?,?,?)",
          [clip.clipURL, clip.eventID, clip.caption]
        );
      } else {
        await db.query(
          "UPDATE clips SET clipURL=?, eventID=?, caption=? WHERE clipID=?",
          [clip.clipURL, clip.eventID, clip.caption, clip.id]
        );
      }
    } catch (err) {
      console.error("Error uploading clip:", err);
      return Promise.reject("Error uploading clip");
    }
  }
}
export async function updateArchiveEntry(data: ArchiveEntry) {
    try {
      const result = await db.query("SELECT * FROM archive WHERE eventID = ?", [data.eventDetails.eventID]);
      if (result.length > 0) {
        await db.query("UPDATE archive SET report = ? WHERE eventID = ?", [data.report, data.eventDetails.eventID]);
      }
      await uploadClips(data.clips);
      return "Value Updated";
    } catch (err) {
      console.error("Error updating archive entry:", err);
      return Promise.reject("Error updating archive entry");
    }
  }
  
  async function insertArchiveEntry(data: ArchiveEntry) {
    try {
      await db.query("INSERT INTO archive (report, eventID) VALUES (?,?)", [data.report, data.eventDetails.eventID]);
      await uploadClips(data.clips);
      return "Values Inserted";
    } catch (err) {
      console.error("Error inserting archive entry:", err);
      return Promise.reject("Error inserting archive entry");
    }
  }
  

// save archive data
export async function archivePOST(data: ArchiveEntry) {
    const existingEntry = await db.query("SELECT * FROM archive WHERE eventID = ?", [data.eventDetails.eventID]);
    if (existingEntry.length > 0) {
      return await updateArchiveEntry(data);
    } else {
      return await insertArchiveEntry(data);
    }
  }
  

// delete archive entry
export function archiveDELETE(id: number) {
// app.delete('/archiveDELETE/:id', (req, res) => {
    db.query("DELETE FROM archive WHERE id = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            result.send("Value Deleted")
        }
    })
}

// update archive entry.. archiveID, eventID, report
export function archivePUT(arch: ArchiveEntry) {
    db.query("UPDATE archive SET report = ? WHERE archiveID = ?", [arch.report, arch.archiveID], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            result.send("Value Updated")
        }
    })
}


export function playlistGET(id: number) { 
    return new Promise<PlaylistEntry[]>((resolve, reject) => {
    const sQuery = `SELECT playlistID, playorder, musicTrackID, trackName, artist 
    from playlists join music on playlists.musicID=music.musicTrackID 
    ${id === -1 ? 'order by playorder' : 'WHERE playlists.eventID=? order by playorder'}`;
      db.query(sQuery, id)
      .then((result: any[]) => {
        const playlistEntries: PlaylistEntry[] = result.map((row) => ({
          id: result.indexOf(row), // Use index for unique id
          playlistID: row.playlistID,
          playorder: row.playorder,
          eventID: id,
          musicTrack: {
            id: row.musicTrackID, // Add the id property
            musicTrackID: row.musicTrackID,
            trackName: row.trackName,
            artist: row.artist,
            lyrics: row.lyrics,
            soprano: row.soprano,
            alto: row.alto,
            tenor: row.tenor,
            allParts: row.allParts,
            piano: row.piano,
          },
        }));
        resolve(playlistEntries);
        }
        )
        .catch((err: any) => {
            console.error(err);
            reject(err);
          });
    }
    )
}


// save playlist data
export function playlistPOST(data: PlaylistEntry[]) {
    return new Promise<string>((resolve, reject) => {
    const eventID = data[0].eventID
    // delete all of the existing playlist entries for the event
    db.query("DELETE FROM playlists WHERE eventID = ?", eventID, (err: any, result: any) => {
        if(err) {
            console.log(err)
        }
    }).then(() => {
    for(var i = 0; i < data.length; i++) {
        db.query("INSERT INTO playlists (eventID, musicID, playorder) VALUES (?, ?, ?)", [data[i].eventID, data[i].musicTrack.musicTrackID, data[i].playorder], (err: any, result: any) => {
            if(err) {
                console.log(err)
            }
        }
        )
    }
    resolve("Values Inserted")
}
)
}
)
}

//eventID, location, eventDate, startTime, endTime, price, title
// to make the const below available from other pages we need to export it
export  const  EventDets = (id: number): Promise<EventDetails[]> => {
    const sQuery = `SELECT * FROM choirevents ${id === -1 ? '' : 'WHERE eventID = ?'}`;
  
    return db.query(sQuery, id)
      .then((result: any[]) => {
        const events: EventDetails[] = result.map((row) => ({
          eventID: row.eventID,
          location: row.location,
          eventDate: new Date(row.eventDate), // Convert string to Date if needed
          startTime: row.startTime,
          endTime: row.endTime,
          price: row.price,
          title: row.title,
          meetingPoint: row.meetingPoint,
          invitation: row.invitation,
          playlist: [], // Initialize playlist as an empty array
        }));
        return events;
      })
      .catch((err: any) => {
        console.error(err);
        return Promise.reject(err); // Return a rejected promise with the error
      });
  };




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


// we need to use the Promise.all() method to get the data from the promises
export function eventComplete(id: number): Promise<EventDetails[]> {
    return Promise.all([EventDets(id), playlistGET(id)])
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
export function eventsPOST(data: EventDetails): string {
    // the event data is sent as an eventDetails json object. So we need to extract the data from the object
    // create a new eventDetails object and load the data into it
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
            console.log(err)
        } else {
            result.send("Values Inserted")
        }
    });

    return "Values Inserted";
}

// delete event entry

export function eventsDELETE(id: number) {
    db.query("DELETE FROM event WHERE id = ?", id, (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            result.send("Value Deleted")
        }
    })
}

// update event entry
export function eventsPUT(data: EventDetails) {
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
            result.send("Value Updated")
        }
    })
}

export function siteinfo() {
    return new Promise<SiteInfo>((resolve, reject) => {
    db.query("SELECT * FROM siteinfo", (err: any, result: any) => {
        if(err) {
            console.log(err)
            reject(err)
        } else {
            let siteInfo: SiteInfo = EmptySiteInfo();
            for(var i = 0; i < result.length; i++) {
                siteInfo.HomeTitle = result[i].HomeTitle;
                siteInfo.HomeText = result[i].HomeText;
                siteInfo.AboutTitle = result[i].AboutTitle;
                siteInfo.AboutText = result[i].AboutText;
                siteInfo.ArchiveTitle = result[i].ArchiveTitle;
                siteInfo.ArchiveText = result[i].ArchiveText;
                siteInfo.NoticesTitle = result[i].NoticesTitle;
                siteInfo.NoticesText = result[i].NoticesText;
                siteInfo.BookingTitle = result[i].BookingTitle;
                siteInfo.BookingText = result[i].BookingText;
                siteInfo.MembersTitle = result[i].MembersTitle;
                siteInfo.MembersText = result[i].MembersText;
                siteInfo.AppealTitle = result[i].AppealTitle;
                siteInfo.AppealText = result[i].AppealText;
                siteInfo.SettingsTitle = result[i].SettingsTitle;
                siteInfo.SettingsText = result[i].SettingsText;
            }
            resolve(siteInfo)
        }
    }
    )
}
)
}

//id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText
export function siteinfoPUT(data: SiteInfo) {
    return new Promise<string>((resolve, reject) => {
    //console.log(req.body)
    db.query("UPDATE siteinfo SET HomeTitle = ?, HomeText = ?, AboutTitle = ?, AboutText = ?, ArchiveTitle = ?, ArchiveText = ?, NoticesTitle = ?, NoticesText = ?, BookingTitle = ?, BookingText = ?, MembersTitle = ?, MembersText = ?, AppealTitle = ?, AppealText = ?, SettingsTitle = ?, SettingsText = ? ", [data.HomeTitle, data.HomeText, data.AboutTitle, data.AboutText, data.ArchiveTitle, data.ArchiveText, data.NoticesTitle, data.NoticesText, data.BookingTitle, data.BookingText, data.MembersTitle, data.MembersText, data.AppealTitle, data.AppealText, data.SettingsTitle, data.SettingsText], (err: any, result: any) => {
        if(err) {
            console.log(err)
            reject(err)
        }
        resolve("Values Updated")
    }
    )
}
)
}


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

export const Music = (id: number): Promise<MusicTrack[]> => {
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
      };

    export function ArchiveDetail(id: number): Promise<ArchiveEntry> {
        return Promise.all([ArchiveBasics(id), EventBasics(id), ImagesFromEvent(id), clipsFromEvent(id)])
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




      export function imagesPOST(data: ImageDetail, res: Response) {
        db.query("INSERT INTO images SET filename = ?, caption = ?, eventID = ?", [data.filename, data.caption, data.eventID], (err: any) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error inserting image");
          } else {
            db.query("SELECT LAST_INSERT_ID()", (err: any, result: number[]) => {
              if (err) {
                console.log(err);
                res.status(500).send("Error getting image ID");
              } else {
                data.imageID = result[0];
                res.json(data);
              }
            });
          }
        });
      }
      
// insert a music track and return the object with the musicTrackID
export function MusicPOST(data: MusicTrack): MusicTrack {
    return db.query("INSERT INTO music SET ?", data, (err: any) => {
        if (err) {
            return data;
        } else {
            // get the id of the last inserted record
            db.query("SELECT musicTrackID from music order by musicTrackID DESC LIMIT 1", (err: any, result: any) => {
                if (err) {
                    return data;
                } else {
                    data.musicTrackID = result[0];
                    return data;
                }
            }
            );
        }
    }
    );
}

export function postClip(data: Clip) {
//function postClip(data) {
    db.query("INSERT INTO clip SET ?", data, (err: any, result: any) => {
        if(err) {
            console.log(err)
            result.status(500).send("Error inserting clip");
        } else {
            // send a status message to the client
            result.send("Values Inserted")
        }
    }
    )
}

// export function fetchData(query, params) {
//     return new Promise((resolve, reject) => {
//       db.query(query, params, (error, results) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(results);   
  
//         }
//       });
//     });
//   }

export function deleteImageRecord(params: number) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM images WHERE imageID = ?", params, (error: string) => {
        if (error) {
          reject(error);
        } else {
          resolve("success");   
  
        }
      });
    });
  }



// update image entry
export function imagesPUT(data: ImageDetail) {
    const imageID = data.imageID;
    const title = data.filename;
    const description = data.caption;
    const eventID = data.eventID;

    //// imageID, filename, caption, eventID
    db.query("UPDATE images SET filename = ?, caption = ?, eventID = ? WHERE imageID = ?", [title, description, eventID], (err: any, result: any) => {
        if(err) {
            console.log(err)
        } else {
            result.send("Value Updated")
        }
    }).catch((err: any) => {
        console.error(err);
        return Promise.reject("Error updating image");
        }
    )
}


// get the music list
export function musicListPOST(data: MusicTrack) {
    db.query("INSERT INTO music SET ?", data, (err: any, result: any) => {
        if(err) {
            console.log(err)
            result.status(500).send("Error inserting music"); 
        } else {
            result.send("Values Inserted")
        }
    })
}


export function musicListDELETE(id: number): string {
    return db.query("DELETE FROM music WHERE id = ?", id, (err: any, result: any) => {
        if (err) {
            console.log(err);
            return ("Error deleting music");
        } else {
            return ("success");
        }
    });
}

// update music entry
export function musicListPUT(data: MusicTrack) {
    db.query("UPDATE music SET trackName=? lyrics=? soprano=? alto=? tenor=? allParts=? WHERE musicTrackID = ?", [data.trackName, data.lyrics, data.soprano, data.alto, data.tenor, data.allParts, data.musicTrackID], (err: any, result: any) => {
        if(err) {
            console.log(err)
            result.status(500).send("Error updating music");
        } else {
            result.send("Music Updated")
        }
    }
    )
}

module.exports = {
    login,
    loginAddUser,
    loginDeleteUser,
    upcomingPlaylists,
    eventArchive,
    themeDetails,
    ImagesFromEvent,
    themeDetailsPUT,
    themeDetailsRandom,
    archivePOST,
    archiveDELETE,
    archivePUT,
    playlistPOST,
    playlistGET,
    eventComplete,
    eventsPOST,
    eventsDELETE,
    eventsPUT,
    siteinfo,
    Music,
    musicList,
    MusicPOST
}
