import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ loggedUser }) {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        navigate('/home');
        window.location.reload();
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'static', marginBottom: '60px' }}>
            <AppBar>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div" sx={{ marginRight: '15px' }}>
                        Event ticketing system
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Button color="inherit" sx={{ margin: '3px' }} onClick={() => handleNavigation('/home')}>
                            Events
                        </Button>
                        {loggedUser && (
                            <>
                                <Button color="inherit" sx={{ margin: '3px' }} onClick={() => handleNavigation('/tickets')}>
                                    Tickets
                                </Button>
                                <Button color="inherit" sx={{ margin: '3px' }} onClick={() => handleNavigation('/create-event')}>
                                    Create event
                                </Button>
                            </>
                        )}
                    </Box>
                    {loggedUser ? (
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:"center", alignItems:"center" }}>
                            <Typography sx={{ margin: '0 10px' }}>{loggedUser.name + " "+loggedUser.surname}</Typography>
                            <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
                        </Box>
                    ) : (
                        <Button color="inherit" onClick={handleLoginClick}>Login</Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
