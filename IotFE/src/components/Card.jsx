import React from 'react';
import { Avatar, Box, Card as MuiCard, CardContent, Typography } from "@mui/material";

const Card = ({ title, color = "primary", icon, stats }) => {
  return (
    <MuiCard>
      <CardContent sx={{ display: "flex", alignItems: "stretch" }}>
        <Box sx={{ flexGrow: 1, paddingLeft: "10px" }}>
          <Box
            sx={{
              display: "flex",
              marginBottom: 1,
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                boxShadow: 3,
                marginRight: 2,
                color: "common.white",
                backgroundColor: `${color}.main`,
              }}
            >
              {icon}
            </Avatar>
          </Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: "0.875rem", paddingTop: "10px" }}
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}>
          <Typography variant="h3">{stats}</Typography>
        </Box>
      </CardContent>
    </MuiCard>
  );
};

export default Card;

