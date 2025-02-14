import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QueryInput from './components/QueryInput';
import ResponseCard from './components/ResponseCard';
import AddPersonButton from './components/AddPersonButton';
import AddProjectButton from './components/AddProjectButton';
import CircularProgress from '@mui/material/CircularProgress'; // Import the CircularProgress component
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PeopleTab from './components/PeopleTab';
import ProjectsTab from './components/ProjectsTab';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#feca57',
    },
    background: {
      default: '#fff9f9',
    },
  },
});

interface QueryResponse {
  query: string;
  response: string;
  sources: { title: string; description: string }[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [responses, setResponses] = useState<QueryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuery = async (query: string) => {
    setLoading(true); // Set loading to true when the query starts

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: query }),
      });
      const data: QueryResponse = await response.json();
      console.log(data.sources);
      setResponses([...responses, data]);
    } catch (error) {
      console.error('Error sending query:', error);
    } finally {
      setLoading(false); // Set loading to false once the request finishes
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Group Hug
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Chat" />
              <Tab label="People" />
              <Tab label="Projects" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <>
              <Box sx={{ mb: 2 }}>
                {responses.map((response, index) => (
                  <ResponseCard key={index} response={response} />
                ))}
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <QueryInput onSubmit={handleQuery} />
              )}

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <AddPersonButton />
                <AddProjectButton />
              </Box>
            </>
          )}

          {tabValue === 1 && <PeopleTab />}
          {tabValue === 2 && <ProjectsTab />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
