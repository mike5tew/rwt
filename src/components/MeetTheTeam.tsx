import { useEffect, useState } from 'react';
import { 
  ImageList, 
  ImageListItem, 
  Paper, 
  Typography, 
  Card, 
  useMediaQuery, 
  useTheme, 
  CircularProgress, 
  Alert,
  Grid 
} from '@mui/material';
import { teamGET } from '../services/queries';
import { Team } from '../types/types.d';
import { processImageUrl } from '../services/ImageHandling';
import { useNavigate } from 'react-router-dom';

interface ProcessedTeam extends Team {
  processedImageUrl?: string;
}

export default function MeetTheTeam() {
    const [teamList, setTeamList] = useState<ProcessedTeam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [screenSize, setScreenSize] = useState<string>(localStorage.getItem('screenSize') || 'desktop');
   
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));



    // Fetch team data
    useEffect(() => {
        
        const fetchTeamData = async () => {
            setLoading(true);
            try {
                const teamData = await teamGET();
                
                if (!Array.isArray(teamData)) {
                    throw new Error('Unexpected data format received');
                }

                const processedTeam = teamData.map(member => ({
                    ...member,
                    processedImageUrl: processImageUrl(member.Image?.filename, screenSize)
                }));

                setTeamList(processedTeam);
            } catch (err) {
                console.error('Error fetching team data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load team data');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    // Render team member card
    const renderTeamMember = (member: ProcessedTeam) => (
        <ImageListItem key={member.ID} cols={1} rows={2} sx={{ mb: 3 }}>
            <Card sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                p: isMobile ? 2 : 3,
                boxShadow: 3,
                height: '100%'
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <img 
                            src={member.processedImageUrl || '/default-image.png'} 
                            alt={member.Image?.caption || member.Name} 
                            style={{ 
                                width: '100%', 
                                height: 'auto',
                                borderRadius: '4px',
                                objectFit: 'cover'
                            }} 
                            loading="lazy"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            sx={{ 
                                fontSize: isMobile ? '1.5rem' : '2rem',
                                fontWeight: 700
                            }}
                        >
                            {member.Name}
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                whiteSpace: 'pre-wrap',
                                fontSize: isMobile ? '0.9rem' : '1rem',
                                lineHeight: 1.6
                            }}
                        >
                            {member.Description}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        </ImageListItem>
    );

    return (
        <Grid container spacing={2} sx={{ p: isMobile ? 1 : 3 }}>
            <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontSize: isMobile ? '1.8rem' : '2.5rem',
                            fontWeight: 700,
                            color: theme.palette.primary.main
                        }}
                    >
                        Meet the Team
                    </Typography>
                </Paper>
            </Grid>
            
            <Grid item xs={12}>
                {loading ? (
                    <Grid container justifyContent="center" sx={{ py: 5 }}>
                        <CircularProgress />
                    </Grid>
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                ) : teamList.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>No team members found.</Alert>
                ) : (
                    <ImageList 
                        gap={isMobile ? 4 : 8} 
                        cols={1} 
                        sx={{ width: '100%', m: 0 }}
                    >
                        {teamList.map(renderTeamMember)}
                    </ImageList>
                )}
            </Grid>
        </Grid>
    );
}