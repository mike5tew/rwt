import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Typography, Divider, TextField, Fade, Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Grid from '@mui/material/Grid'; // Import Grid
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { EventDetails, EmptyEventDetails, StringtoDate } from '../types/types.d';
import { useNavigate } from 'react-router-dom';
import { EventPOST, UpcomingEventsList, EventGET, EventDELETE, EventsGET } from '../services/queries';
import { NotificationSnackbar } from './shared/NotificationSnackbar';



const schema = yup.object().shape({
    Title: yup.string().required("Title is required"),
    Location: yup.string().required("Location is required"),   
    EventDate: yup.date().typeError("Please enter a valid date").required("Event Date is required"),
    StartTime: yup.string().required("Start Time is required"),
    EndTime: yup.string().required("End Time is required"),   
    MeetingPoint: yup.string().required("Meeting Point is required"),
    Price: yup.string().optional(),
    Invitation: yup.string().required("Invitation is required"),
    DateString: yup.string().optional()
});

type EventFormValues = {
    Title: string;
    Location: string;
    EventDate: Date;
    StartTime: string;
    EndTime: string;
    MeetingPoint: string;
    Price?: string;
    Invitation: string;
    DateString?: string;
};

export default function EventAdd() {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<EventFormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            ...EmptyEventDetails(),
            EventDate: new Date()
        }
    });
    const history = useNavigate();
    // if the cookie is not set, and the role is not admin, redirect to the members page
    if (document.cookie === '' || document.cookie.indexOf('role=administrator') === -1) {
        console.log('No cookie');
        history('/Members');
    }
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [eventID, setEventID] = useState(0);
    const [eventSelected, setEventSelected] = useState(false);
    const [event, setEvent] = useState<EventDetails>(EmptyEventDetails());
    
    const [state, setState] = useState<{
        open: boolean;
        Transition: typeof Fade;
    }>({
        open: false,
        Transition: Fade,
    });
      const [eventList, setEventList] = useState<EventDetails[]>([]);

    const handleClick = () => {
        setSnackMessage('Event added');
        setSnackOpen(true);
        setState({
            ...state,
            open: true,
        });
        (document.getElementById("NewEvent") as HTMLFormElement)?.reset();
    };

    const handleClose = () => {
        setSnackOpen(false);
    };

    useEffect(() => {
        // get the upcoming events
        if (document.cookie.indexOf('role=administrator') === -1) { history('/Settings'); }        

            // get the event list from the database
            EventsGET().then((res: EventDetails[]) => {
              // remove events that are in the future
              //res = res.filter((event: EventDetails) => new Date(event.EventDate) <= new Date());
              setEventList(res);
            });
        
          }
            , []);

    function EventDelete() {
        if (eventID === 0) {
            setSnackMessage('No event selected');
            setSnackOpen(true);
            return;
        }
        if (window.confirm("Are you sure you want to delete this event?")) {
            EventDELETE(eventID).then((res) => {
                if (res.status === 204) {
                    setSnackMessage('Event deleted');
                    setSnackOpen(true);
                    setEventID(0);
                    setEventSelected(false);
                    clearForm();
                } else {
                    setSnackMessage('Event not deleted');
                    setSnackOpen(true);
                }
            }
            );
        }
    };


    const onSubmit = () => {
        const eventDate = new Date(watch('EventDate'));
        if (isNaN(eventDate.getTime())) {
            setSnackMessage('Invalid event date');
            setSnackOpen(true);
            return;
        }

        const formattedDate = eventDate.toISOString().split('T')[0]; // Format to yyyy-MM-dd

        const newEvent: EventDetails = {
            ...EmptyEventDetails(),
            Title: watch('Title'),
            Location: watch('Location'),
            DateString: formattedDate,
            StartTime: watch('StartTime'),
            EndTime: watch('EndTime'),
            Price: watch('Price') || '',
            MeetingPoint: watch('MeetingPoint'),
            Invitation: watch('Invitation')
        };

        EventPOST(newEvent).then((res) => {
            if (res.Title === "Event Added") {
                handleClick();
            } else {
                setSnackMessage('Event not added');
                setSnackOpen(true);
            }
        });
    };

    function clearForm() {
          setValue("Title", '');
          setValue("Location", '');
          setValue("DateString", '');
          setValue("StartTime", '');
          setValue("EndTime", '');
          setValue("Price", '');
          setValue("MeetingPoint", '');
          setValue("Invitation", '');
          setEventID(0);
          setEventSelected(false);
          setEvent(EmptyEventDetails());
        console.log('Form cleared');
      }

    function handleEventSelect(event: SelectChangeEvent<unknown>) {
        const value = Number(event.target.value);
        if (isNaN(value)) {
            console.error("Invalid event ID");
            return;
        }
        setEventID(value);
        if (value === 0) {
          clearForm();
          setEventID(0);
          setEventSelected(false);
        } else {
          setEventSelected(true);
            EventGET(value).then((res) => {
                console.log(res);
                setEvent(res);
                setValue("Title", res.Title);
                setValue("Location", res.Location);
                setValue("DateString", res.DateString);
                // convert the string to a date and format it to yyyy-MM-dd
                setValue("EventDate", res.EventDate);
                setValue("StartTime", res.StartTime);
                setValue("EndTime", res.EndTime);
                setValue("Price", res.Price);
                setValue("MeetingPoint", res.MeetingPoint);
                setValue("Invitation", res.Invitation);
            });
        }
    }
          
function formatDate(dateString: string) {
    var date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const newString = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    date = new Date(newString);
    console.log(date);
    return date;
}

    return (
        <Box>
            <form id="NewEvent" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h2" align="center" gutterBottom>Add Event</Typography>
                <Grid container spacing={2}>
                <Grid item xs={12} > {/* //Event dropdown  */}
              <FormControl fullWidth><InputLabel id="ExistingEvents">Events</InputLabel>
                <Select label="Select an event" value={eventID} onChange={handleEventSelect} fullWidth >
                  <MenuItem value={0} >Select Event</MenuItem>
                  {eventList && eventList.map((event) => (
                    <MenuItem key={event.EventID} value={event.EventID}>{event.Title + " " + StringtoDate(event.EventDate.toString())}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="Title" required
                            label="Title"
                            fullWidth
                            {...register("Title")}
                            InputLabelProps={{
                                shrink: !!watch('Title') // Dynamically shrink label if Title exists
                            }}
                            error={!!errors.Title}
                            helperText={errors.Title?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="Location" required
                            label="Location"
                            fullWidth
                            {...register("Location")}
                            InputLabelProps={{
                                shrink: !!watch('Location') // Dynamically shrink label if Location exists
                            }}
                            error={!!errors.Location}
                            helperText={errors.Location?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            type="date"
                            fullWidth
                            {...register('EventDate')}
                            InputLabelProps={{
                                shrink: !!watch('EventDate') // Dynamically shrink label if EventDate exists
                            }}
                            error={!!errors.EventDate}
                            helperText={errors.EventDate?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="StartTime"
                            label="Start Time"
                            fullWidth
                            {...register("StartTime")}
                            InputLabelProps={{
                                shrink: !!watch('StartTime') // Dynamically shrink label if StartTime exists
                            }}
                            error={!!errors.StartTime}
                            helperText={errors.StartTime?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="EndTime"
                            label="End Time"
                            fullWidth
                            {...register("EndTime")}
                            InputLabelProps={{
                                shrink: !!watch('EndTime') // Dynamically shrink label if EndTime exists
                            }}
                            error={!!errors.EndTime}
                            helperText={errors.EndTime?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="Price"
                            label="Price"
                            fullWidth
                            {...register("Price")}
                            InputLabelProps={{
                                shrink: !!watch('Price') // Dynamically shrink label if Price exists
                            }}
                            error={!!errors.Price}
                            helperText={errors.Price?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="MeetingPoint"
                            label="Meeting Point"
                            fullWidth
                            {...register("MeetingPoint")}
                            InputLabelProps={{
                                shrink: !!watch('MeetingPoint') // Dynamically shrink label if MeetingPoint exists
                            }}
                            error={!!errors.MeetingPoint}
                            helperText={errors.MeetingPoint?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="Invitation"
                            label="Invitation message"
                            fullWidth
                            {...register("Invitation")}
                            InputLabelProps={{
                                shrink: !!watch('Invitation') // Dynamically shrink label if Invitation exists
                            }}
                            error={!!errors.Invitation}
                            helperText={errors.Invitation?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">
                            Save Changes
                        </Button>
                        <Button variant="contained" onClick={EventDelete} style={{ marginLeft: '10px' }}>
                            Delete Event
                        </Button>
                    </Grid>
                </Grid>
            </form>
                        <NotificationSnackbar
                            open={snackOpen}
                            message={snackMessage}
                            onClose={() => setSnackOpen(false)}
                        />

           
        </Box>
    );
}