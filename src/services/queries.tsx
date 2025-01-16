import { EventDetails, ArchiveEntry, Clip, ImageDetail, Message, User, PlaylistEntry, EmptyMusicTrack, MusicTrack, SiteInfo, ThemeDetails } from "../types/types.d";

// we need to change the functions below to fetching the data from an api

const baseUrl = process.env.REACT_APP_API_URL || '/api';  // Allow configurable API URL
async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
    console.log(`Fetching from: ${baseUrl}/${endpoint}`);

    const defaultOptions: RequestInit = {
        credentials: 'include',  // Include credentials for CORS
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',  // Prevent caching
        },
        ...options,
    };

    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, defaultOptions);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }

        // Handle no content responses
        if (response.status === 204) {
            return null as unknown as T;
        }

        // Ensure we get the complete response
        const text = await response.text();
        try {
            return JSON.parse(text) as T;
        } catch (e) {
            console.error('Error parsing JSON:', e);
            throw new Error('Invalid JSON response');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// insert a music track and return the object with the musicTrackID
export async function MusicPOST(req: MusicTrack): Promise<MusicTrack> {
    const respon = await fetch(`${baseUrl}/musicTrackPOST`, {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await respon.json();
    if (respon.status === 201) {
        return data;
    } else {
        return EmptyMusicTrack();
    }
}

export async function ClipPOST(req: Clip): Promise<Clip>  {
    const respon = await fetch(`${baseUrl}/ClipPOST`, {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await respon.json();
    return data;
}

export async function ImageDELETE(params: number): Promise<string> {
    const respon = await fetch(`${baseUrl}/ImageDELETE/${params}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    if (respon.status === 204) {
        return 'Image Deleted';
    } else {
        return 'Image Not Deleted';
    }
}

export async function ImagePUT(req: any, res: any) {
    const respon = await fetch(`${baseUrl}/imagesPUT`, {
        method: 'PUT',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await respon.json();
    return data;
}

export async function MusicTrackPOST(req: MusicTrack): Promise<MusicTrack> {
    const respon = await fetch(`${baseUrl}/musicListPOST`, {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await respon.json();
    return data;
}

export async function musicTrackDELETE(req: number): Promise<string> {
    const respon = await fetch(`${baseUrl}/musicTrackDELETE/${req}`);
    const data = await respon.json();
    return data;
}

export async function MusicTrackPUT(req: MusicTrack): Promise<string> {
    const respon = await fetch(`${baseUrl}/uusicTrackPUT`, {
        method: 'PUT',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await respon.json();
    return data;
}

export async function ArchivesGET(req: number): Promise<ArchiveEntry[]> {
     const requestString = `ArchivesGET?screen=${localStorage.getItem('screenSize')}&archives=${req}`;
     console.log(requestString);
    return fetchData<ArchiveEntry[]>(requestString);
}

export async function messagesGET(): Promise<Message[]> {
    return fetchData<Message[]>('messagesGET');
}

export async function messageDELETE(messageID: number): Promise<void> {
    const response = await fetch(`${baseUrl}/messageDELETE/${messageID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }
    // No content to parse as the response is 204 No Content
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

export async function playlistDELETE(id: number): Promise<Response> {
    const respon = await fetch(`${baseUrl}/playlistDELETE/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return respon;
}

export async function EventsUpcomingGET(): Promise<EventDetails[]> {
    return fetchData<EventDetails[]>('EventsUpcomingGET');
}

export async function upcomingPlaylists(): Promise<EventDetails[]> {
    return fetchData<EventDetails[]>('upcomingPlaylistsGET');
}

export async function EventArchive(req: any): Promise<ArchiveEntry> {
    return fetchData<ArchiveEntry>(`eventArchiveGET/${req}`);
}

export async function ImageBackGET(): Promise<ImageDetail[]> {
    return fetchData<ImageDetail[]>(`ImageBackGET`);
}

export async function ClipsFromEvent(id: number): Promise<Clip[]> {
    return fetchData<Clip[]>(`clipsFromEventGET/${id}`);
}
// randomImget returns an array of imagedetails or a string
export async function randomImagesGET(req: number): Promise<ArchiveEntry | string> {
    console.log(`RandomImagesGET?screen=${localStorage.getItem('screenSize')}&images=${req}`);
    return fetchData<ArchiveEntry | string >( `RandomImagesGET?screen=${localStorage.getItem('screenSize')}&images=${req}` );
}

export async function ArchiveFromEvent(id: number): Promise<ArchiveEntry> {
    return fetchData<ArchiveEntry>(`ArchiveFromEventGET/${id}`);
}

export async function themeDetailsGET(): Promise<ThemeDetails> {
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

export async function UpcomingEventsList(): Promise<EventDetails[]> {
    return fetchData<EventDetails[]>('UpcomingEventsListsGET');
}

export async function PastEventsList(): Promise<EventDetails[]> {
    return fetchData<EventDetails[]>('EventsListGET');
}

export async function ClipsPOST(req: Clip[]): Promise<string> {
    return fetchData<string>('ClipsPOST', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function ClipDELETE(req: number): Promise<Clip> {
    const respon = await fetch(`${baseUrl}/ClipDELETE/${req}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    console.log(respon);
    const data = await respon.json();
    return data;
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

export async function ArchivePOST(req: ArchiveEntry): Promise<ArchiveEntry> {
    return fetchData<ArchiveEntry>('ArchiveEntryPOST', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    }).then((data) => {
        return data;
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

export function playlistGET(req: number): Promise<PlaylistEntry[]> {
    return fetchData<PlaylistEntry[]>(`PlaylistGET/${req}`);
}

export async function playlistPOST(req: PlaylistEntry[]): Promise<PlaylistEntry> {
    return fetchData<PlaylistEntry>('PlaylistPOST', {
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

export async function EventPOST(req: EventDetails): Promise<EventDetails> {
    return fetchData<EventDetails>('EventPOST', {
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
    try {
        const data = await fetchData<SiteInfo>('SiteInfoGET');
        console.log('SiteInfoGET complete data:', data);
        return data;
    } catch (error) {
        console.error('Error in SiteInfoGET:', error);
        throw error;
    }
}

export async function SiteinfoPUT(req: SiteInfo): Promise<string> {
    return fetchData<string>('SiteInfoPUT', {
        method: 'PUT',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function MusicGET(req: number): Promise<MusicTrack[]> {
    if (req === -1) {
        return fetchData<MusicTrack[]>('musicListGET');
    } else {
        return fetchData<MusicTrack[]>(`MusicTrackGET/${req}`);
    }
}

export async function EventArchivesGET(req: number): Promise<ArchiveEntry[]> {
    return fetchData<ArchiveEntry[]>(`EventArchiveGET/${req}`);
}

export async function EventArchiveGET(id: number): Promise<ArchiveEntry> {
    return fetchData<ArchiveEntry>(`EventArchiveGET/${id}`);
}