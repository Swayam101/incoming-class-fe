import React, { useEffect, useRef } from 'react'
import { 
  Group, 
  Button, 
  Box, 
  rem,
  Container,
  Burger,
  Drawer,
  Stack,
  Flex,
  useMantineTheme
} from '@mantine/core'
import { Link } from 'react-router'
import { useDisclosure } from '@mantine/hooks'
import NavLink from './HeaderNavLink';
import Logo from './Logo';
import gsap from 'gsap';

export const Header: React.FC = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  
  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Header animation
    const headerTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Animate the header from slightly above its position
    headerTimeline.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    );
    
    // Animate the logo
    headerTimeline.fromTo(
      logoRef.current,
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.3" // Slight overlap with header animation
    );
    
    // Animate the nav links with stagger
    headerTimeline.fromTo(
      navLinksRef.current?.children || [],
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
      "-=0.2"
    );
    
    // Animate the buttons with stagger
    headerTimeline.fromTo(
      buttonsRef.current?.children || [],
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
      "-=0.2"
    );
    
  }, []);
  
  return (
    <Box
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,0,48,0.95) 100%)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <Container px={{ base: 16, sm: 32, lg: 48 }} size="100%" h={{ base: 70, sm: 80, md: 90 }}>
        <Group justify="space-between" style={{ height: '100%' }}>
          {/* Logo */}
          <Box ref={logoRef}>
            <Logo darkMode />
          </Box>
          
          {/* Desktop Navigation */}
          <Flex ref={navLinksRef} display={{ base: 'none', sm: 'flex' }} gap={rem(5)} direction="row">
            <NavLink to="/" label="Home" darkMode displayMode="horizontal" />
            <NavLink to="/feed" label="Feed" darkMode displayMode="horizontal" />
          </Flex>
          
          {/* Desktop Action Buttons */}
          <Group ref={buttonsRef} align="center" gap={rem(16)} display={{ base: 'none', sm: 'flex' }}>
            <Button 
              variant="outline" 
              color="red" 
              radius="md" 
              size="sm"
              component={Link} 
              to="/login"
              style={{
                fontWeight: 600,
                borderColor: theme.colors.red[5],
                color: theme.white,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(229, 56, 59, 0.1)',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              Login
            </Button>
            <Button 
              variant="filled" 
              radius="md" 
              size="sm"
              component={Link} 
              to="/signup"
              style={{
                fontWeight: 600,
                backgroundColor: '#4361ee',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#3a0ca3',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              Sign Up
            </Button>
          </Group>
          
          {/* Mobile Burger */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            color={theme.white}
            display={{ sm: 'none' }}
            size="md"
          />
        </Group>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="CollegeConnect"
        hiddenFrom="sm"
        zIndex={1000}
        transitionProps={{ transition: 'slide-right', duration: 300 }}
        styles={{
          title: { fontSize: rem(20), fontWeight: 700, color: theme.white },
          header: { 
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderBottom: `1px solid ${theme.colors.dark[6]}`,
            height: 70
          },
          body: { 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(26,0,48,0.98) 100%)',
            padding: rem(32)
          },
          close: { color: theme.white }
        }}
      >
        <Stack align='center' gap="xl" mt={20}>
          <NavLink to="/" label="Home" darkMode displayMode="vertical" onClick={closeDrawer} />
          <NavLink to="/feed" label="Feed" darkMode displayMode="vertical" onClick={closeDrawer} />
         
          
          <Box h={20} />
          
          <Button 
            fullWidth
            variant="outline" 
            color="red" 
            radius="md" 
            size="md" 
            component={Link} 
            to="/login"
            onClick={closeDrawer}
            style={{
              fontWeight: 600,
              borderColor: theme.colors.red[5],
              color: theme.white
            }}
          >
            Login
          </Button>
          
          <Button 
            fullWidth
            variant="filled" 
            radius="md" 
            size="md" 
            component={Link} 
            to="/signup"
            onClick={closeDrawer}
            style={{
              fontWeight: 600,
              backgroundColor: '#4361ee'
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default Header; 