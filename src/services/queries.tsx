// import exp from "constants";
// import e from "cors";
import { EmptyEventDetails, EmptyArchiveEntry, EventDetails, ArchiveEntry, Clip, EmptyClip, ImageDetail, EmptyImageDetail, Message, User, PlaylistEntry, EmptyMusicTrack, EmptyPlaylistEntry, MusicTrack, SiteInfo, EmptySiteInfo, ThemeDetails, EmptyThemeDetails } from "../types/types.d";

// we need to change the functions below to fetching the data from an api
const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT;

async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`http://${url}:${port}/${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }
    return response.json();
}

// insert a music track and return the object with the musicTrackID
export async function MusicPOST(req: MusicTrack): Promise<MusicTrack> {
    const respon = await fetch(`http://${url}:${port}/MusicTrackPOST`, {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    })
    const data = await respon.json();
    return data;
}


export async function ClipPOST(req: Clip): Promise<Clip> {
    const respon = await fetch(`http://${url}:${port}/ClipPOST`, {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    })
    const data = await respon.json();
    return data;
}

export async function ImageDELETE(params: number): Promise<string> {
    const respon = await fetch(`http://${url}:${port}/deleteImageRecord/${params}`)
    const data = await respon.json();
    return data;
}

export async function ImagePUT(req: any, res: any) {
    const respon = await fetch(`http://${url}:${port}/imagesPUT`, {
        method: 'PUT',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
    })
    const data = await respon.json();
    return data;
}

export async function MusicTrackPOST(req: MusicTrack): Promise<MusicTrack> {
    const respon = await fetch(`http://${url}:${port}/musicListPOST`, {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    })
    const data = await respon.json();
    return data;
}

export async function musicTrackDELETE(req: number): Promise<string> {
    const respon = await fetch(`http://${url}:${port}/musicTrackDELETE/${req}`)
    const data = await respon.json();
    return data;
}

export async function MusicTrackPUT(req: MusicTrack): Promise<string> {
    const respon = await fetch(`http://${url}:${port}/MusicTrackPUT`, {
        method: 'PUT',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    })
    const data = await respon.json();
    return data;
}

export async function ArchivesGET(numberReq: number): Promise<ArchiveEntry[]> {
    return fetchData<ArchiveEntry[]>(`ArchivesGET/${numberReq}`);
}

export async function messagesGET(): Promise<Message[]> {
    return fetchData<Message[]>('messagesGET');
}

export async function messageDELETE(messageID: number): Promise<void> {
    await fetchData<void>('messageDELETE', {
        method: 'DELETE',
        body: JSON.stringify(messageID),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function messagePOST(req: Message): Promise<Message> {
    return fetchData<Message>('messagePOST', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function login(req: User): Promise<String> {
    return fetchData<string>('login', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export function loginAddUser(req: any, res: any): Promise<void> {
    return new Promise<void>((resolve) => {
        const users: User[] = JSON.parse(process.env.users || '[]');
        users.push({ Username: req.body.username, Password: req.body.password, Role: req.body.role });
        process.env.users = JSON.stringify(users);
        res.send("User Added");
        resolve();
    });
}

export function loginDeleteUser(req: any, res: any): Promise<void> {
    return new Promise<void>((resolve) => {
        let users: User[] = JSON.parse(process.env.users || '[]');
        users = users.filter(user => user.Username !== req.body.username);
        process.env.users = JSON.stringify(users);
        res.send("User Deleted");
        resolve();
    });
}

export async function EventsUpcomingGET(): Promise<EventDetails[]> {
    return fetchData<EventDetails[]>('EventsUpcomingGET');
}

export async function upcomingPlaylists(): Promise<EventDetails[]> {
    return fetchData<EventDetails[]>('upcomingPlaylists');
}

export async function EventArchive(req: any): Promise<ArchiveEntry> {
    return fetchData<ArchiveEntry>(`eventArchiveGET/${req}`);
}

export async function ImagesFromEvent(id: number): Promise<ImageDetail[]> {
    return fetchData<ImageDetail[]>(`ImagesFromEventGET/${id}`);
}

export async function ClipsFromEvent(id: number): Promise<Clip[]> {
    return fetchData<Clip[]>(`clipsFromEventGET/${id}`);
}

export async function randomImagesGET(req: number): Promise<ImageDetail[]> {
    return fetchData<ImageDetail[]>(`RandomImagesGET/${req}`);
}

export async function ArchiveFromEvent(id: number): Promise<ArchiveEntry> {
    return fetchData<ArchiveEntry>(`ArchiveFromEventGET/${id}`);
}

export async function themeDetails(): Promise<ThemeDetails> {
    return fetchData<ThemeDetails>('ThemeDetailsGET');
}

export async function ThemeDetailsPUT(req: ThemeDetails): Promise<string> {
    return fetchData<string>('ThemeDetailsPUT', {
        method: 'PUT',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function ThemeDetailsRandomGET(): Promise<ThemeDetails> {
    return fetchData<ThemeDetails>('ThemeDetailsRandomGET');
}

export async function musicList(): Promise<MusicTrack[]> {
    return fetchData<MusicTrack[]>('musicListGET');
}

export async function EventsList(): Promise<EventDetails[]> {
    return fetchData<EventDetails[]>('UpcomingEventsListsGET');
}

export async function ClipsPOST(req: Clip[]): Promise<string> {
    return fetchData<string>('ClipsPOST', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function ClipDELETE(req: number): Promise<string> {
    return fetchData<string>(`ClipDELETE/${req}`);
}

export async function updateArchiveEntry(req: ArchiveEntry): Promise<string> {
    return fetchData<string>('updateArchiveEntry', {
        method: 'PUT',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function insertArchiveEntry(req: ArchiveEntry): Promise<string> {
    return fetchData<string>('ArchiveEntryPOST', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function ArchivePOST(req: ArchiveEntry): Promise<string> {
    return fetchData<string>('ArchivePOST', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function archiveDELETE(req: number): Promise<string> {
    return fetchData<string>(`archiveDELETE/${req}`);
}

export async function archivePUT(req: ArchiveEntry): Promise<string> {
    return fetchData<string>('archivePUT', {
        method: 'PUT',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function playlistGET(req: number): Promise<PlaylistEntry[]> {
    return fetchData<PlaylistEntry[]>(`upcomingPlaylistsGET/${req}`);
}

export async function playlistPOST(req: PlaylistEntry[]): Promise<string> {
    return fetchData<string>('playlistPOST', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function EventDets(req: number): Promise<EventDetails[]> {
    return fetchData<EventDetails[]>(`EventDetsGET/${req}`);
}

export async function eventImages(req: number): Promise<ImageDetail[]> {
    return fetchData<ImageDetail[]>(`EventImagesGET/${req}`);
}

export async function EventGET(req: number): Promise<EventDetails> {
    return fetchData<EventDetails>(`EventGET/${req}`);
}

export async function EventPOST(req: EventDetails): Promise<string> {
    return fetchData<string>('eventPOST', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function EventDELETE(req: number): Promise<string> {
    return fetchData<string>(`EventDELETE/${req}`);
}

export async function EventPUT(req: EventDetails): Promise<string> {
    return fetchData<string>('eventsPUT', {
        method: 'PUT',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function SiteInfoGET(): Promise<SiteInfo> {
    return fetchData<SiteInfo>('SiteInfoGET');
}

export async function SiteinfoPUT(req: SiteInfo): Promise<string> {
    return fetchData<string>('siteinfoPUT', {
        method: 'PUT',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function MusicGET(req: number): Promise<MusicTrack[]> {
    if (req === -1) {
        return fetchData<MusicTrack[]>('MusicListGET');
    } else {
        return fetchData<MusicTrack[]>(`MusicTrackGET/${req}`);
    }
}

export async function EventArchiveGET(req: number): Promise<ArchiveEntry> {
    return fetchData<ArchiveEntry>(`EventArchiveGET/${req}`);
}