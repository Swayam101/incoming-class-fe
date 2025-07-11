import React, { useState } from 'react';
import {
  Container,
  Stack,
  useMantineTheme,
  Box,
  Skeleton,
  SimpleGrid,
  rem,
  Text,
  Center,
} from '@mantine/core';
import { useStudentProfileData } from './hooks';
import { glassCardStyles } from './utils/glassStyles';
import type { Gender } from '../../models/user.model';


import ModernProfileHeader from './components/ModernProfileHeader';
import ModernTabNavigation from './components/ModernTabNavigation';
import StudentProfileOverviewTab from './components/StudentProfileOverviewTab';

const StudentProfilePage: React.FC = () => {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Custom hook for student profile data with API integration
  const { profileData, isLoading, error } = useStudentProfileData();

  // Error state
  if (error) {
    return (
      <Box 
        style={{ 
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
          padding: rem(16),
        }}
      >
        <Container size="lg" py="md">
          <Center style={{ minHeight: '60vh' }}>
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(40), textAlign: 'center' }}>
              <Text size="lg" c="red" mb="md">Failed to load student profile</Text>
              <Text c="dimmed">The student profile could not be found or there was an error loading the data.</Text>
            </Box>
          </Center>
        </Container>
      </Box>
    );
  }

  // Loading skeleton for initial page load
  if (isLoading || !profileData) {
    return (
      <Box 
        style={{ 
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
          padding: rem(16),
        }}
      >
        <Container size="lg" py="md">
          <Stack gap="sm">
            <Skeleton height={180} radius="xl" />
            <SimpleGrid cols={3} spacing="xs">
              <Skeleton height={100} radius="xl" />
              <Skeleton height={100} radius="xl" />
              <Skeleton height={100} radius="xl" />
            </SimpleGrid>
            <Skeleton height={200} radius="xl" />
          </Stack>
        </Container>
      </Box>
    );
  }

  // Get college name from either College object or string
  const getCollegeName = () => {
    if (!profileData.college) return "";
    return typeof profileData.college === 'object' ? profileData.college.name : "";
  };

  return (
    <Box 
      style={{ 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        minHeight: '100vh',
        padding: rem(16),
        position: 'relative',
      }}
    >
      <Container size="lg" py="md">
        {/* Modern Profile Header */}
          <ModernProfileHeader
            name={profileData.firstName + " " + profileData.lastName}
            designation={getCollegeName()}
            profilePicture={profileData.profilePicture || ""}
            hometown={profileData.hometown || ""}
            bio={profileData.bio || ""}
            isPremium={profileData.isPremium}
            isEditable={false}
            gender={profileData.gender as Gender}
          />
        
        {/* Modern Tab Navigation */}
          <ModernTabNavigation
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value as string)}
          />
        
        {/* Tab Content - Only Overview Tab */}
          <StudentProfileOverviewTab
            profileData={profileData}
            isLoading={false}
          />
        

      </Container>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default StudentProfilePage; 