import React, { useState, useEffect } from "react";
import {
  Box,
  TextInput,
  ActionIcon,
  Group,
  Badge,
  useMantineTheme,
  Collapse,
  Paper,
  Tooltip,
} from "@mantine/core";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";
// import PostButton from './PostButton';
import BoostPost from "./BoostPost";
import { useFeedStore } from "../../../store/feed.store";
import { useDebouncedValue } from "@mantine/hooks";
import { PremiumSubscriptionModal } from "../../../components/common/PremiumSubscriptionModal";

interface MobileSearchBarProps {
  onFiltersClick: () => void;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  onFiltersClick,
}) => {
  const theme = useMantineTheme();

  // State for premium modal
  const [premiumModalOpened, setPremiumModalOpened] = useState(false);
  const [modalTrigger, _setModalTrigger] = useState<string>("search");

  // Get feed store state and actions
  const { filters, searchPosts } = useFeedStore();

  // Local state for debounced search
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle debounced search (only if user has access)
  useEffect(() => {
    searchPosts(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchPosts]);

  // Update local search when filters change externally
  useEffect(() => {
    setSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    searchPosts("");
  };

  // Handle filters button click
  const handleFiltersClick = () => {
    onFiltersClick();
  };

  // Dynamically build list of active filters (excluding searchQuery)
  const activeFilterBadges: { key: keyof typeof filters; label: string }[] = [];

  if (filters.lastDays !== 30) {
    activeFilterBadges.push({ key: 'lastDays', label: `Last ${filters.lastDays} days` });
  }

  if (filters.college && filters.college !== 'all') {
    activeFilterBadges.push({ key: 'college', label: 'College' });
  }

  if (filters.major) activeFilterBadges.push({ key: 'major', label: 'Major' });
  if (filters.hometown) activeFilterBadges.push({ key: 'hometown', label: 'Home State' });
  if (filters.religion) activeFilterBadges.push({ key: 'religion', label: 'Religion' });
  if (filters.gender) activeFilterBadges.push({ key: 'gender', label: 'Gender' });
  if (filters.campusInvolvement) activeFilterBadges.push({ key: 'campusInvolvement', label: 'Campus' });
  if (filters.other) activeFilterBadges.push({ key: 'other', label: 'Other' });

  // Lifestyle arrays / values
  if (filters.sleepSchedule) activeFilterBadges.push({ key: 'sleepSchedule', label: 'Sleep' });
  if (filters.cleanliness) activeFilterBadges.push({ key: 'cleanliness', label: 'Cleanliness' });
  if (filters.guests) activeFilterBadges.push({ key: 'guests', label: 'Guests' });
  if (filters.studying) activeFilterBadges.push({ key: 'studying', label: 'Studying' });
  if (filters.personality?.length) activeFilterBadges.push({ key: 'personality', label: 'Personality' });
  if (filters.physicalActivity?.length) activeFilterBadges.push({ key: 'physicalActivity', label: 'Activity' });
  if (filters.pastimes?.length) activeFilterBadges.push({ key: 'pastimes', label: 'Pastimes' });
  if (filters.food?.length) activeFilterBadges.push({ key: 'food', label: 'Food' });

  const activeFiltersCount = activeFilterBadges.length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <>
      <Box mb="md">
        <Paper
          p="sm"
          radius="md"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Group gap="xs" align="center">
            {/* Search Input */}
            <Box style={{ flex: 1 }}>
              <TextInput
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                leftSection={<IconSearch size={16} />}
                rightSection={
                  searchQuery ? (
                    <ActionIcon
                      size="sm"
                      variant="transparent"
                      color="gray"
                      onClick={handleClearSearch}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  ) : null
                }
                size="md"
                styles={{
                  input: {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: theme.white,
                    border: isSearchFocused
                      ? `1px solid ${theme.colors.blue[5]}`
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    "&::placeholder": {
                      color: theme.colors.gray[6],
                    },
                    "&:disabled": {
                      backgroundColor: "rgba(255, 215, 0, 0.05)",
                      color: theme.colors.gray[5],
                    },
                  },
                }}
              />
            </Box>

            {/* Action Buttons Group */}
            <Group gap="xs">
              {/* Edit Post Button */}
              {/* <Tooltip 
              label={"Edit your post"} 
              position="bottom"
              withArrow
            >
              <Box>
                <PostButton 
                  variant="icon" 
                />
              </Box>
            </Tooltip> */}

              {/* Boost Post Button */}
              <Tooltip label={"Boost your post"} position="bottom" withArrow>
                <Box>
                  <BoostPost variant="button" />
                </Box>
              </Tooltip>

              {/* Filter Button */}
              <Tooltip label="Filter posts" position="bottom" withArrow>
                <ActionIcon
                  size="lg"
                  variant="light"
                  color={hasActiveFilters ? "blue" : "gray"}
                  onClick={handleFiltersClick}
                  style={{
                    position: "relative",
                    backgroundColor: hasActiveFilters
                      ? "rgba(67, 97, 238, 0.2)"
                      : "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <IconFilter size={20} />
                  {activeFiltersCount > 0 && (
                    <Badge
                      size="xs"
                      color="red"
                      variant="filled"
                      style={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        minWidth: 16,
                        height: 16,
                        padding: 0,
                        fontSize: "10px",
                        lineHeight: "16px",
                      }}
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          {/* Active Filters Preview */}
          <Collapse in={hasActiveFilters}>
            <Box pt="sm">
              <Group gap="xs">
                {activeFilterBadges.map((badge) => (
                  <Badge
                    key={badge.key}
                    color="blue"
                    variant="light"
                    size="xs"
                    styles={{
                      root: { textTransform: 'none' },
                    }}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </Group>
            </Box>
          </Collapse>
        </Paper>
      </Box>

      {/* Premium Subscription Modal */}
      <PremiumSubscriptionModal
        opened={premiumModalOpened}
        onClose={() => setPremiumModalOpened(false)}
        trigger={modalTrigger}
      />
    </>
  );
};
