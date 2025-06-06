import React from "react";
import { Box, Container, Grid, Stack, Button, Text, Group } from "@mantine/core";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router";
import { FiltersSidebar } from "../../components/Feed/FiltersSidebar/FiltersSidebar";
import { PremiumFeatures } from "../../components/Feed/PremiumFeatures/PremiumFeatures";
import AnimatedBackground from "./components/AnimatedBackground";
import FeedContent from "./components/FeedContent";

// CSS for responsive design
const responsiveStyles = `
  @media (max-width: 768px) {
    .desktop-only {
      display: none !important;
    }
  }
  
  @media (min-width: 769px) {
    .mobile-only {
      display: none !important;
    }
  }
`;

const FeedPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <Box
      style={{
        backgroundColor: "#101720",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Add responsive CSS */}
      <style>{responsiveStyles}</style>
      
      {/* Animated background for visual appeal */}
      <AnimatedBackground />

      <Container size="xl" px={{ base: 16, sm: 32, md: 32 }} py={{ base: 20, sm: 30, md: 40 }}>
        {!user ? (
          // Unauthenticated view - Show limited feed with login prompt
          <Box>
            <Box
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "24px",
                marginBottom: 32,
                textAlign: "center",
              }}
            >
              <Text size="xl" fw={600} c="white" mb="md">
                Join the Conversation
              </Text>
              <Text c="dimmed" mb="xl">
                Sign up or log in to connect with other students, share your experiences, and get personalized content.
              </Text>
              <Group justify="center" gap="md">
                <Button
                  variant="filled"
                  color="blue"
                  size="md"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  size="md"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>
              </Group>
            </Box>
            
            {/* Three column layout for unauthenticated users */}
            <Grid gutter={{ base: 16, sm: 24, md: 32 }}>
              {/* Left Column - Filters & Search - Hidden on mobile */}
              <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className="desktop-only">
                <FiltersSidebar />
              </Grid.Col>

              {/* Middle Column - Feed Content */}
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <FeedContent />
              </Grid.Col>

              {/* Right Column - Premium Features - Hidden on mobile */}
              <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className="desktop-only">
                <PremiumFeatures />
              </Grid.Col>
            </Grid>
          </Box>
        ) : (
          // Authenticated view - Show full feed with sidebars
          <Grid gutter={{ base: 16, sm: 24, md: 32 }}>
            {/* Left Column - Filters & Search - Hidden on mobile */}
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className="desktop-only">
              <FiltersSidebar />
            </Grid.Col>

            {/* Middle Column - Feed Content */}
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <FeedContent />
            </Grid.Col>

            {/* Right Column - Premium Features - Hidden on mobile */}
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className="desktop-only">
              <PremiumFeatures />
            </Grid.Col>
          </Grid>
        )}

        {/* Mobile Bottom Navigation - Only shown on mobile for authenticated users */}
        {user && (
          <Box
            className="mobile-only"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "12px 0",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(10px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              zIndex: 100,
            }}
          >
            <Stack>
              {/* Mobile navigation will be added here */}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FeedPage; 