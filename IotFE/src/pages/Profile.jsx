import React from 'react';
import { Box, Typography, Avatar, Link, Card, CardContent, Grid } from '@mui/material';
import { FaGithub, FaBook, FaFileAlt } from 'react-icons/fa';

const Profile = () => {
  const fullName = "Thái Minh Vũ";
  const studentId = "B21DCDT250";
  const githubUrl = "https://github.com/MinhVu-287/IotProject";
  const swaggerUrl = "http://localhost:8080/swagger-ui/index.html";
  const documentationUrl = "https://docs.google.com/document/d/1uTsrBp12WADXzlwzgxjkyIW-T_xjKOHnJ1nhPaBKw6Q/edit";

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      {/* User Avatar */}
      <Avatar sx={{ width: 120, height: 120, mb: 2 }}>A</Avatar>

      {/* Basic Profile Information */}
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {fullName}
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center">
            Mã sinh viên: {studentId}
          </Typography>
        </CardContent>
      </Card>

      {/* Links Section */}
      <Box mt={3} width="100%">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <LinkCard
              icon={<FaGithub size={24} />}
              title="GitHub"
              url={githubUrl}
              description="My project repository"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LinkCard
              icon={<FaBook size={24} />}
              title="Swagger"
              url={swaggerUrl}
              description="API documentation"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LinkCard
              icon={<FaFileAlt size={24} />}
              title="Documentation"
              url={documentationUrl}
              description="Project documentation"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Reusable Card Component for Links
const LinkCard = ({ icon, title, url, description }) => {
  return (
    <Card sx={{ minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box mr={1}>{icon}</Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={1}>
          {description}
        </Typography>
        <Link href={url} target="_blank" rel="noopener" underline="hover" color="primary">
          Visit {title}
        </Link>
      </CardContent>
    </Card>
  );
};

export default Profile;
