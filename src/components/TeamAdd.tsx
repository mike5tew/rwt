//This page allows the admin the add a new team
// member to the database. It uses the TeamAddForm component to render the form and handle the submission.

import{ useEffect, useState } from 'react';
import TeamAddForm from './TeamAddForm';
import { Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { teamGET, memberDELETE } from '../services/queries';
import { Team, ImageDetail } from '../types/types.d';

/**
 * TeamAdd Component
 * Page for adding new team members using the TeamAddForm component
 */

export default function TeamAdd() {
  const history = useNavigate();
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [editingMember, setEditingMember] = useState<Team | null>(null); // State for the member being edited

  // Redirect if the user is not an admin
  if (document.cookie === '' || document.cookie.indexOf('role=administrator') === -1) {
    console.log('No cookie');
    history('/Members');
  }

  // Fetch the list of team members
  useEffect(() => {
    console.log("Starting teamGET fetch");
    teamGET()
      .then((data: Team[]) => { // Added type hint for clarity
        console.log('Team members fetched:', data);
        console.log('Array?', Array.isArray(data));
        if (Array.isArray(data)) {
          var tempTeam: Team[]
          console.log(`Processing ${data.length} team members`);
          // Run through the list and add the image URL to the team member
          const updatedTeamList = data.map((member, index) => {
            console.log(`Processing member ${index}: ${member.Name}`);
            let imageUrlWithPath = '/default-image.png'; // Default image URL
            let finalFilename = ''; // Default filename
            let finalImageID = 0;
            let finalCaption = '';
            console.log('image?', (member.Image && member.Image.filename));
            // Check if FileDetail exists and has necessary properties
            if (member.Image && member.Image.filename) {
              finalFilename = member.Image.filename; // Use the existing filename
              finalImageID = member.Image.imageID || 0;
              finalCaption = member.Image.caption || '';
              
              // Fix: Clean up whitespace and ensure path construction is correct
              if (finalFilename) {
                imageUrlWithPath = `${process.env.REACT_APP_API_URL}/images/desktop/${finalFilename}`; // Construct the full path
                console.log(`Image URL for ${member.Name}: ${imageUrlWithPath}`); // Add logging for debugging
              }
            }

            // Create the Image object matching the ImageDetail type structure (Uppercase properties)
            const fileDetailForFrontend: ImageDetail = {
              imageID: finalImageID,
              filename: finalFilename,
              caption: finalCaption,
              imageURL: imageUrlWithPath, // This should now be correctly set
              eventID: member.Image?.eventID -1,
              height: member.Image?.height || 0,
              width: member.Image?.width || 0,
              cols: member.Image?.cols || 0,
              rows: member.Image?.rows || 0,
              imagetype: member.Image?.imagetype || '',
            };
            
            // Log the constructed image detail for debugging
            console.log(`Constructed imageURL: ${imageUrlWithPath}`);
            
            const result = {
              ...member,
              Image: fileDetailForFrontend,
            };
            
            console.log(`Final member object for ${member.Name}:`, result);
            return result;
          });
          // Set the updated team list
          console.log("Setting teamList with processed data:", updatedTeamList);
          setTeamList(updatedTeamList);
        } else {
          console.error('Unexpected data format:', data);
          setTeamList([]); // Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error('Error fetching team members:', error);
        setTeamList([]); // Fallback to an empty array
      });
  }, []); // useEffect dependencies are empty as teamGET doesn't depend on component state/props

  // Handle member selection
  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const memberId = event.target.value as number;
    setSelectedMember(memberId);
    
    // Find the selected member's data
    const member = teamList.find((m) => m.ID === memberId) || null;
    
    // Debug the selected member's image data
    if (member) {
      console.log('Selected member:', member);
      console.log('Image data:', member.Image);
      console.log('Image URL:', member.Image?.imageURL);
      console.log('Image filename:', member.Image?.filename);
    }
    
    setEditingMember(member); // Set the member being edited
  };

  // Handle member deletion
  const handleDeleteMember = async () => {
    if (selectedMember !== null) {
      try {
        const response = await memberDELETE(selectedMember);
        if (response.status === 204) {
          setTeamList(teamList.filter((member) => member.ID !== selectedMember));
          setSelectedMember(null);
          setEditingMember(null); // Clear the editing member
          alert('Team member deleted successfully');
        } else {
          alert('Error deleting team member');
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
        alert('Error deleting team member');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="team-member-select-label">Select Team Member</InputLabel>
          <Select
            labelId="team-member-select-label"
            value={selectedMember !== null ? selectedMember : ''}
            onChange={handleSelectChange}
            fullWidth
          >
            <MenuItem value="">
              <em>Add Team Member</em>
            </MenuItem>
            {teamList && teamList.map((member) => (
              <MenuItem key={member.ID} value={member.ID}>
                {member.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={handleEditMember}
            disabled={selectedMember === null}
          >
            Edit Member
          </Button> */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteMember}
            disabled={selectedMember === null}
          >
            Remove Member
          </Button>
        </Box>
      </Box>
      <TeamAddForm editingMember={editingMember} /> {/* Pass the editing member to the form */}
    </Container>
  );
}

