import { Link } from '@mui/material';
import { MusicTrack } from '../types/types';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

interface MusicTreeListProps {
    TrackList: MusicTrack | MusicTrack[];
}

export default function MusicTreeList({ TrackList }: MusicTreeListProps) {
    // Convert single track to array if needed
    const tracks = Array.isArray(TrackList) ? TrackList : [TrackList];
    console.log(tracks);
    const getEntry = (entry: MusicTrack, index: number) => {
        const elementArray: JSX.Element[] = [];
        // Loop through the keys in the entry and add them if they have a value
        for (var key in entry) {
            switch (key) {
                case "Lyrics":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry.Lyrics} >
                                <TreeItem itemId={`${entry.MusicTrackID}-l`} label="Lyrics" >Download</TreeItem>
                            </Link>
                        );
                    }
                    break;
                case "Piano":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry.AllParts} >
                                <TreeItem itemId={`${entry.MusicTrackID}-p`} label="Piano" >Download</TreeItem>
                            </Link>
                        );
                    }
                    break;
                case "AllParts":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry[key]} >
                                <TreeItem itemId={`${entry.MusicTrackID}-ap`} label="All Parts" >Download</TreeItem>
                            </Link>
                        );
                    }
                    break;
                case "Soprano":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry.Soprano} >
                                <TreeItem itemId={`${entry.MusicTrackID}-s`} label="Soprano" >Download</TreeItem>
                            </Link>
                        );
                    }
                    break;
                case "Alto":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry.Alto} >
                                <TreeItem itemId={`${entry.MusicTrackID}-a`} label="Alto" >Download</TreeItem>
                            </Link>
                        );
                    }
                    break;
                case "Tenor":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry.Tenor} >
                                <TreeItem itemId={`${entry.MusicTrackID}-t`} label="Tenor" >Download</TreeItem>
                            </Link>
                        );
                    }
                    break;
                case "Bass":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry.Bass} >
                                <TreeItem itemId={`${entry.MusicTrackID}-b`} label="Bass" >Download</TreeItem>
                            </Link>
                        );
                    }
                    break;
                case "Artist":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry[key]} >
                                <TreeItem itemId={`${entry.MusicTrackID}-a`} label="Artist" >Download</TreeItem>
                            </Link>
                        );
                    }
                    break;
                // in the case of the extra title, we want to display the extra title and the link to the extra url
                case "ExtraTitle":
                    if (entry[key] !== "") {
                        elementArray.push(
                            <Link href={entry.ExtraLink} >
                                <TreeItem itemId={`${entry.MusicTrackID}-e`} label={entry.ExtraTitle} >Download</TreeItem>
                            </Link>
                        );
                    }

            }
        }
        return (
            elementArray
        );
    }

    return (
        <SimpleTreeView>
            {tracks.map((track, index) => (
                <TreeItem
                    key={index}
                    itemId={'track' + track.MusicTrackID}
                    label={track.TrackName || 'Untitled'}
                >
                    {getEntry(track, index)}
                </TreeItem>
            ))}
        </SimpleTreeView>
    );
}