import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import InsightsIcon from "@mui/icons-material/Insights";

import SearchIcon from "@mui/icons-material/Search";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";

import logo from "../assets/images/SolarisLogoWht.png";

const drawerWidth = 240;

const dashboardNavItems = [
  { label: "Dashboard", to: "/dashboard", icon: DashboardIcon },
  { label: "Reports", to: "/dashboard/reports", icon: AssessmentIcon },
  { label: "Users", to: "/dashboard/users", icon: PeopleIcon, adminOnly: true },
  {
    label: "Articles",
    to: "/dashboard/articles",
    icon: InsightsIcon,
  },
];

const AppBar = styled(MuiAppBar)(() => ({
  zIndex: 1201,
  background: "#000",
  borderBottom: "1px solid rgba(251,146,60,0.2)",
  height: "72px",
  justifyContent: "center",
}));

const Drawer = styled(MuiDrawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    background: "linear-gradient(to bottom, #0b0f19, #000)",
    color: "white",
    borderRight: "1px solid rgba(251,146,60,0.15)",
  },
}));

const Search = styled("div")(() => ({
  position: "relative",
  borderRadius: "999px",
  backgroundColor: "#111827",
  marginRight: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
}));

const SearchIconWrapper = styled("div")(() => ({
  padding: "0 10px",
  position: "absolute",
  height: "100%",
  display: "flex",
  alignItems: "center",
  color: "#9ca3af",
}));

const StyledInputBase = styled(InputBase)(() => ({
  color: "white",
  paddingLeft: "40px",
}));

const DashLayout = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Read current user's role from localStorage
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  })();

  const isAdmin = currentUser?.type === "admin";

  // Filter out adminOnly items for non-admin users
  const visibleNavItems = dashboardNavItems.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <CssBaseline />

      {/* TOP BAR */}
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ minHeight: "72px !important" }}>
          {/* LOGO */}
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "14px",
              gap: "10px",
            }}
          >
            <img
              src={logo}
              alt="Solaris Logo"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>

          <Typography
            sx={{
              flexGrow: 1,
              color: "white",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            Solaris Studio
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search..." />
          </Search>

          <Button
            onClick={() => navigate("/")}
            sx={{
              ml: 2,
              px: 4,
              py: 1,
              borderRadius: "999px",
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              border: "1px solid #fb923c",
              color: "#fb923c",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "#fb923c", color: "white" },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer variant="permanent">
        <Toolbar />

        <List>
          {visibleNavItems.map(({ label, to, icon: Icon }) => (
            <ListItem key={to} disablePadding>
              <ListItemButton
                component={Link}
                to={to}
                selected={location.pathname === to}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: "12px",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(251,146,60,0.15)",
                  },
                  "&:hover": { backgroundColor: "rgba(251,146,60,0.08)" },
                }}
              >
                <ListItemIcon sx={{ color: "#fb923c", minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* MAIN */}
      <Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
        <Toolbar sx={{ minHeight: "72px !important" }} />
        <div style={{ width: "100%" }}>
          <Outlet />
        </div>
      </Box>
    </Box>
  );
};

export default DashLayout;
