export interface ScreenSize {
    width: number;
    height: number;
    devicePixelRatio: number;
    images: number
}

export function getScreenSize(): ScreenSize {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        images: 0
    };
}

export interface ImageDetail {
    ImageID: number;
    ImageURL: string;
    Filename: string;
    Caption: string;
    Rows: number;
    Cols: number;
    Height: number;
    Width: number;
    EventID: number;
    Imagetype: number;
}

export function EmptyImageDetail(): ImageDetail {
    return {
        ImageID: 0,
        ImageURL: "",
        Filename: "",
        Caption: "",
        Rows: 1,
        Cols: 1,
        Height: 0,
        Width: 0,
        EventID: 0,
        Imagetype: 0
    };
}

export interface DatURLResponse {
    ReturnedFile: File;
    FileDetails: ImageDetail;
}
export function EmptyDatURLResponse(): DatURLResponse {
    return {
        ReturnedFile: new File([], ""),
        FileDetails: EmptyImageDetail()
    };
}



//eventID, location, eventDate, startTime, endTime, price, title
export interface EventDetails {
    EventID: number;
    Location: string;
    EventDate: Date;
    DateString: string;
    StartTime: string;
    EndTime: string;
    Invitation: string;
    MeetingPoint: string;
    Price: string;
    Title: string;
    Playlist: PlaylistEntry[];
}

// themeDetails, boxColour, textColour, textFont, backgroundImage, textboxColour, logoimage, bannerColour, menuColour, buttonColour, buttonHover, buttonTextColour, menuTextColour
export interface ThemeDetails {
    BoxColour: string;
    TextColour: string;
    TextFont: string;
    BackgroundImage: string;
    TextboxColour: string;
    LogoImage: string;
    BannerColour: string;
    MenuColour: string;
    ButtonColour: string;
    ButtonHover: string;
    ButtonTextColour: string;
    MenuTextColour: string;
    TextSize: number;
}
export function EmptyThemeDetails(): ThemeDetails {
    return {
        BoxColour: "",
        TextColour: "",
        TextFont: "",
        BackgroundImage: "",
        TextboxColour: "",
        LogoImage: "",
        BannerColour: "",
        MenuColour: "",
        ButtonColour: "",
        ButtonHover: "",
        ButtonTextColour: "",
        MenuTextColour: "",
        TextSize: 0
    };
}

export function DefaultThemeDetails(): ThemeDetails {
    return {
        BoxColour: "white",
        TextColour: "black",
        TextFont: "Arial",
        BackgroundImage: "Musical Background.png",
        TextboxColour: "white",
        LogoImage: "Choir Logo.png",
        BannerColour: "blue",
        MenuColour: "blue",
        ButtonColour: "blue",
        ButtonHover: "darkblue",
        ButtonTextColour: "white",
        MenuTextColour: "white",
        TextSize: 24
    };
}

export function EmptyEventDetails(): EventDetails {
    return {
        EventID: 0,
        Location: "",
        EventDate: new Date(),
        DateString: "",
        StartTime: "",
        EndTime: "",
        Invitation: "",
        MeetingPoint: "",
        Price: "",
        Title: "",
        Playlist: [],
    };
}

//playlistID, eventID, musicID, playorder
export interface PlaylistEntry {
    ID: number;
    PlaylistID: number;
    EventID: number;
    MusicTrack: MusicTrack;
    Playorder: number;
}

export function EmptyPlaylistEntry(): PlaylistEntry {
    return {
        Id: 0,
        PlaylistID: 0,
        EventID: 0,
        MusicTrack: EmptyMusicTrack(),
        Playorder: 0
    };
}

//clipID, clipURL, eventID, caption
export interface Clip {
    ClipID: number;
    ClipURL: string;
    EventID: number;
    Caption: string;
}
export function EmptyClip(): Clip {
    return {
        ClipID: 0,
        ClipURL: "",
        EventID: 0,
        Caption: ""
    };
}
//archiveID, eventID, report
export interface ArchiveEntry {
    ArchiveID: number;
    NextFile: string;
    Imagecaption: string;
    NextURL: string;
    Clipcaption: string;
    EventDetails: EventDetails;
    Report: string;
    Images: ImageDetail[];
    Clips: Clip[];
}
export function EmptyArchiveEntry(): ArchiveEntry {
    return {
        ArchiveID: 0,
        EventDetails: EmptyEventDetails(),
        NextFile: "",
        Imagecaption: "",
        NextURL: "",
        Clipcaption: "",
        Report: "",
        Images: [],
        Clips: []
    };
}
// musicTrackID, trackName, lyrics, soprano, alto, tenor, allParts
export interface MusicTrack {
    MusicTrackID: number;
    TrackName: string;
    Artist: string;
    Lyrics: string;
    Soprano: string;
    Alto: string;
    Tenor: string;
    AllParts: string;
    Piano: string;
}

export function IsMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    if (regex.test(navigator.userAgent)) {
        return "/images/mobile/";
    } else {
        return "/images/";
    }
}

export const DatetoString = (date: Date) => {
    var nMonth: number = date.getMonth() + 1; // getMonth() returns a value between 0 and 11 so add 1 to get the correct month
    var sMonth: string = nMonth.toString();
    if (nMonth < 10) {
        sMonth = '0' + sMonth;
    }
    var nDay: number = date.getDate();
    var sDay: string = nDay.toString();
    if (nDay < 10) {
        sDay = '0' + sDay;
    }
    var sDate = date.getFullYear() + "-" + sMonth + "-" + sDay;
    return sDate;
}

export function StringtoDate(DateObj: string) {
    // format of string is 2024-06-19T23:00:00.000Z
    var sDate = DateObj.split("-");
    var nMonth = parseInt(sDate[1])
    var sDay = sDate[2].split("T");
    var nDay = parseInt(sDay[0]);
    return nDay + "/" + nMonth
}

//   messageID	int Auto Increment	
//   messageDate	timestamp NULL	
//   messageFrom	varchar(60) NULL	
//   messageContent	varchar(500) NULL ['']	
//   eventName	varchar(100) ['']	
//   eventDate	timestamp	
//   eventTime	varchar(25) ['']	
//   contactEmail	varchar(100) NULL	
//   contactPhone	varchar(20) ['']	
//   eventLocation

export interface Message {
    MessageID: number;
    MessageDate: string
    MessageFrom: string;
    MessageContent: string;
    EventName: string;
    EventDate: string;
    EventTime: string;
    ContactEmail: string;
    ContactPhone: string;
    EventLocation: string;
}

export function EmptyMessage(): Message {
    return {
        MessageID: 0,
        MessageDate: "",
        MessageFrom: "",
        MessageContent: "",
        EventDate: "",
        EventName: "",
        EventTime: "",
        ContactEmail: "",
        ContactPhone: "",
        EventLocation: ""
    };
}
export interface User {
    Username: string;
    Password: string;
    Role: string;
}
export function EmptyUser(): User {
    return {
        Username: "",
        Password: "",
        Role: ""
    };
}

declare var jpgImage: {
    prototype: File;
    new(fileBits: [BlobPart], fileName: string, options?: FilePropertyBag): File;
};

export interface ImageFiles {
    MainImage: File;
    MobileImage: File;
    EventID: number;
}

//id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText

export interface SiteInfo {
    ID: number;
    HomeTitle: string;
    HomeText: string;
    AboutTitle: string;
    AboutText: string;
    ArchiveTitle: string;
    ArchiveText: string;
    NoticesTitle: string;
    NoticesText: string;
    BookingTitle: string;
    BookingText: string;
    MembersTitle: string;
    MembersText: string;
    AppealTitle: string;
    AppealText: string;
    SettingsTitle: string;
    SettingsText: string;
}

export function EmptySiteInfo(): siteInfo {
    return {
        ID: 0,
        HomeTitle: "",
        HomeText: "",
        AboutTitle: "",
        AboutText: "",
        ArchiveTitle: "",
        ArchiveText: "",
        NoticesTitle: "",
        NoticesText: "",
        BookingTitle: "",
        BookingText: "",
        MembersTitle: "",
        MembersText: "",
        AppealTitle: "",
        AppealText: "",
        SettingsTitle: "",
        SettingsText: ""
    };
}

export interface MusicTrack {
    // using the same schema as the music.json file
    MusicTrackID: number,
    TrackName: string,
    Lyrics: string,
    Soprano: string,
    Alto: string,
    Tenor: string,
    AllParts: string,
    Piano: string
}

export function EmptyMusicTrack(): MusicTrack {
    return {
        ID: 0,
        TrackName: "",
        Lyrics: "",
        Soprano: "",
        Alto: "",
        Tenor: "",
        AllParts: "",
        Piano: ""
    };
}


declare module '*.ttf';
