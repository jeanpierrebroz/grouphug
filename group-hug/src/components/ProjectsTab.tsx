import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import InfiniteScroll from 'react-infinite-scroll-component';
import AddProjectButton from './AddProjectButton';
interface Project {
  name: string;
  description: string;
}

const ProjectsTab: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const initialized = useRef(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/get_all_projects?skip=${page * 20}&limit=20`);
      const data = await response.json();
      
      setHasMore(false);
      
      // setProjects(prevProjects => [...prevProjects, ...data.projects]);
      setProjects(data.projects);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    if(!initialized.current){
        fetchProjects();
        initialized.current = true;
        console.log("fetching projects");
    }
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <AddProjectButton />
      </Box>

      <InfiniteScroll
        dataLength={projects.length}
        next={fetchProjects}
        hasMore={hasMore}
        loader={<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
      >
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 2,
          p: 2
        }}>
          {projects.map((project, index) => (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Diversity3Icon />
                  <Typography variant="h6">{project.name}</Typography>
                </Box>
                <Typography variant="body1">{project.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </InfiniteScroll>
    </Box>
  );
};

export default ProjectsTab; 