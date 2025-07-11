import React from 'react';
import {
  Grid,
  Stack,
  Box,
  useMantineTheme,
  rem,
} from '@mantine/core';
import { glassCardStyles } from '../utils/glassStyles';
import { ProfileComponentSkeleton, ProfileContactSkeleton } from './ProfileSkeleton';
import type { User } from '../../../models/user.model';
import type { 
  AcademicData, 
  TraitsData, 
  InterestsData, 
  ContactData 
} from '../hooks/useProfileEditing';

import { Suspense } from 'react';

import BioCard from './BioCard';
import AcademicInfo from './AcademicInfo';
import TraitsPreferences from './TraitsPreferences';
import InterestsCard from './InterestsCard';
import ModernContactCard from './ModernContactCard';

interface ProfileOverviewTabProps {
  profileData: User;
  user: User | null;
  editStates: {
    bio: boolean;
    academic: boolean;
    traits: boolean;
    interests: boolean;
    contact: boolean;
  };
  loadingStates: {
    bio: boolean;
    academic: boolean;
    traits: boolean;
    interests: boolean;
    contact: boolean;
  };
  setEditStates: React.Dispatch<React.SetStateAction<{
    bio: boolean;
    academic: boolean;
    traits: boolean;
    interests: boolean;
    contact: boolean;
  }>>;
  toggleEditState: (section: 'bio' | 'academic' | 'traits' | 'interests' | 'contact') => void;
  handleSaveBio: (newBio: string) => Promise<void>;
  handleSaveAcademic: (academicData: AcademicData) => Promise<void>;
  handleSaveTraits: (traitsData: TraitsData) => Promise<void>;
  handleSaveInterests: (interestsData: InterestsData) => Promise<void>;
  handleSaveContact: (contactData: ContactData) => Promise<void>;
}

const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({
  profileData,
  user,
  editStates,
  loadingStates,
  setEditStates,
  toggleEditState,
  handleSaveBio,
  handleSaveAcademic,
  handleSaveTraits,
  handleSaveInterests,
  handleSaveContact,
}) => {
  const theme = useMantineTheme();

  // Prepare contact data for the contact card
  const contactData = {
    email: user?.email || 'email@university.edu',
    instagram: profileData.instagram || '@username',
    snapchat: profileData.snapchat || '@username',
    university: (profileData.college as unknown as {name:string} ).name || 'University',
  };

  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack gap="md">
          {loadingStates.bio ? (
            <ProfileComponentSkeleton height={120} />
          ) : (
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
              <Suspense fallback={<ProfileComponentSkeleton height={120} />}>
                <BioCard 
                  bio={profileData.bio || 'Add a bio to tell others about yourself.'}
                  isEditable={true}
                  isEditing={editStates.bio}
                  onEdit={() => toggleEditState('bio')}
                  onSave={handleSaveBio}
                  onCancel={() => setEditStates(prev => ({ ...prev, bio: false }))}
                />
              </Suspense>
            </Box>
          )}
          
          {loadingStates.academic ? (
            <ProfileComponentSkeleton height={180} />
          ) : (
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
              <Suspense fallback={<ProfileComponentSkeleton height={180} />}>
                <AcademicInfo 
                  major={profileData.major || 'Not specified'}
                  university={(profileData.college as unknown as {name:string} )?.name || 'University'}
                  hometown={profileData.hometown || 'Not specified'}
                  lookingForRoommate={false} // This field doesn't exist in User interface
                  isEditable={true}
                  isEditing={editStates.academic}
                  onEdit={() => toggleEditState('academic')}
                  onSave={(data) => handleSaveAcademic({
                    academic: {
                      major: data.major,
                      
                    },
                    location: {
                      hometown: data.hometown,
                    },
                    lookingForRoommate: false,
                  })}
                  onCancel={() => setEditStates(prev => ({ ...prev, academic: false }))}
                />
              </Suspense>
            </Box>
          )}
          
          {loadingStates.traits ? (
            <ProfileComponentSkeleton height={280} />
          ) : (
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
              <Suspense fallback={<ProfileComponentSkeleton height={280} />}>
                <TraitsPreferences 
                  sleepSchedule={profileData.sleepSchedule || 'Not specified'}
                  cleanliness={profileData.cleanliness || 'Not specified'}
                  guests={profileData.guests || 'Not specified'}
                  studying="Library" // This field doesn't exist in User interface
                  substances={profileData.substances || 'Not specified'}
                  personality={profileData.personality || []}
                  isEditable={true}
                  isEditing={editStates.traits}
                  onEdit={() => toggleEditState('traits')}
                  onSave={handleSaveTraits}
                  onCancel={() => setEditStates(prev => ({ ...prev, traits: false }))}
                />
              </Suspense>
            </Box>
          )}
        </Stack>
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, md: 4 }}>
        {loadingStates.contact || loadingStates.interests ? (
          <ProfileContactSkeleton />
        ) : (
          <Stack gap="md">
            <Suspense fallback={<ProfileComponentSkeleton height={150} />}>
              <ModernContactCard 
                contactData={contactData} 
                isEditable={true}
                isEditing={editStates.contact}
                onEdit={() => toggleEditState('contact')}
                onSave={handleSaveContact}
                onCancel={() => setEditStates(prev => ({ ...prev, contact: false }))}
              />
            </Suspense>
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
              <Suspense fallback={<ProfileComponentSkeleton height={200} />}>
                <InterestsCard 
                  physicalActivity={profileData.physicalActivity || []}
                  pastimes={profileData.pastimes || []}
                  food={profileData.food || []}
                  campusInvolvement={profileData.campusInvolvement || ''}
                  isEditable={true}
                  isEditing={editStates.interests}
                  onEdit={() => toggleEditState('interests')}
                  onSave={handleSaveInterests}
                  onCancel={() => setEditStates(prev => ({ ...prev, interests: false }))}
                />
              </Suspense>
            </Box>
          </Stack>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default ProfileOverviewTab; 