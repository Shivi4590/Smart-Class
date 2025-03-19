import React, { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ResourceCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Projector Booked',
      resource: 'Projector',
      start: new Date(2024, 2, 15, 10, 0),
      end: new Date(2024, 2, 15, 12, 0),
    },
    {
      title: 'Lab Session',
      resource: 'Computer Lab',
      start: new Date(2024, 2, 16, 14, 0),
      end: new Date(2024, 2, 16, 16, 0),
    },
  ]);

  const [view, setView] = useState('week');

  const handleSelect = ({ start, end }) => {
    const title = window.prompt('Enter booking title:');
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start,
          end,
          resource: 'New Booking',
        },
      ]);
    }
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#3174ad',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Resource Calendar</Typography>
          <Box>
            <Button 
              onClick={() => setView('month')} 
              variant={view === 'month' ? 'contained' : 'outlined'}
              sx={{ mr: 1 }}
            >
              Month
            </Button>
            <Button 
              onClick={() => setView('week')} 
              variant={view === 'week' ? 'contained' : 'outlined'}
              sx={{ mr: 1 }}
            >
              Week
            </Button>
            <Button 
              onClick={() => setView('day')} 
              variant={view === 'day' ? 'contained' : 'outlined'}
            >
              Day
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            selectable
            onSelectSlot={handleSelect}
            eventPropGetter={eventStyleGetter}
            view={view}
            onView={setView}
            views={['month', 'week', 'day']}
            step={60}
            showMultiDayTimes
            defaultDate={new Date()}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ResourceCalendar; 