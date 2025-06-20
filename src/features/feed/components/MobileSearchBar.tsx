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
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconX,
} from "@tabler/icons-react";
import { useFeedStore } from "../../../store/feed.store";
import { useDebouncedValue } from "@mantine/hooks";
import { useAuthStore } from "../../../store/auth.store";

interface MobileSearchBarProps {
  onFiltersClick: () => void;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  onFiltersClick,
}) => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  
  // Get feed store state and actions
  const { filters, searchPosts } = useFeedStore();

  // Local state for debounced search
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle debounced search
  useEffect(() => {
    searchPosts(debouncedSearchQuery, isAuthenticated);
  }, [debouncedSearchQuery, searchPosts, isAuthenticated]);

  // Update local search when filters change externally
  useEffect(() => {
    setSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    searchPosts("", isAuthenticated);
  };

  // Check if any filters are active (only remaining filters)
  const hasActiveFilters = filters.lastDays !== 30 ||
                          (filters.college !== null && filters.college !== 'all');

  const activeFiltersCount = (filters.lastDays !== 30 ? 1 : 0) +
                            (filters.college !== null && filters.college !== 'all' ? 1 : 0);

  return (
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                    color: theme.colors.dark[2],
                  },
                },
              }}
            />
          </Box>

          {/* Filter Button */}
          <ActionIcon
            size="lg"
            variant="light"
            color={hasActiveFilters ? "blue" : "gray"}
            onClick={onFiltersClick}
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
        </Group>

        {/* Active Filters Preview */}
        <Collapse in={hasActiveFilters}>
          <Box pt="sm">
            <Group gap="xs">
              {filters.lastDays !== 30 && (
                <Badge
                  color="indigo"
                  variant="light"
                  size="xs"
                  styles={{
                    root: {
                      textTransform: "none",
                    },
                  }}
                >
                  Last {filters.lastDays} days
                </Badge>
              )}
              {filters.college !== null && filters.college !== 'all' && (
                <Badge
                  color="green"
                  variant="light"
                  size="xs"
                  styles={{
                    root: {
                      textTransform: "none",
                    },
                  }}
                >
                  College Filter
                </Badge>
              )}
            </Group>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};