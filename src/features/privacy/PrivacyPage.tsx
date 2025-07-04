import React, { useRef, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Stack,
  Paper,
  Group,
  ThemeIcon,
  useMantineTheme,
  Badge,
  Anchor,
} from '@mantine/core';
import { 
  IconShield, 
  IconLock, 
  IconEye,
  IconSettings,
  IconMail
} from '@tabler/icons-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from '../feed/components/AnimatedBackground';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Privacy sections data
const privacySections = [
  {
    icon: IconEye,
    title: "Types of Data Collected",
    content: [
      "Personal Data: Email address, full name, social media usernames, uploaded photos, self-identified interests or traits, school choices",
      "Usage Data: IP address, browser type and version, pages visited, time spent on pages, device and diagnostic identifiers, mobile OS and browser data",
      "Third-Party Social Media Data: If you log in via platforms like Google, we may access associated data (email, name, contacts) with your permission"
    ]
  },
  {
    icon: IconSettings,
    title: "How We Use Your Personal Data",
    content: [
      "Provide and operate the Service",
      "Manage your account and subscription",
      "Fulfill payments and transaction contracts",
      "Communicate with you about updates, support, or relevant offers",
      "Analyze and improve the Service",
      "Monitor engagement and detect fraud"
    ]
  },
  {
    icon: IconShield,
    title: "Sharing of Personal Data",
    content: [
      "With service providers like Stripe for payment processing",
      "With universities and educational institutions for research and outreach (engagement metrics, application preferences, commitment status, common search terms, self-identified traits, public profile activity)",
      "With business partners offering services or promotions",
      "For business transfers (e.g., acquisition)",
      "Publicly, if you interact on our Instagram pages",
      "With your consent, for any other purpose"
    ]
  },
  {
    icon: IconLock,
    title: "Your Privacy Rights",
    content: [
      "Request to delete your personal data by contacting support@incomingclass.com",
      "Access and manage your account information",
      "Control privacy settings and data sharing preferences",
      "Receive notifications about policy changes via email or platform announcements"
    ]
  }
];

const PrivacyPage: React.FC = () => {
  const theme = useMantineTheme();
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero section animation - optimized for iOS
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { 
          y: 50, 
          opacity: 0,
          willChange: 'transform, opacity' 
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2, // Slower animation for smoother feel
          stagger: 0.25,
          ease: "power2.out",
          clearProps: 'willChange'
        }
      );
    }

    // Sections animation - optimized for iOS
    if (sectionsRef.current) {
      gsap.fromTo(
        sectionsRef.current.querySelectorAll('.privacy-section'),
        { 
          y: 40, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionsRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          clearProps: 'willChange'
        }
      );
    }

    // Contact section animation - optimized for iOS
    if (contactRef.current) {
      gsap.fromTo(
        contactRef.current,
        { 
          y: 30, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          clearProps: 'willChange'
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Box style={{ 
      backgroundColor: theme.colors.dark[9], 
      minHeight: "100vh",
      WebkitOverflowScrolling: 'touch' // Enable momentum scrolling on iOS
    }}>
      {/* Animated Background - Optimized for iOS */}
      <AnimatedBackground />

      {/* Hero Section */}
      <Box
        style={{
          background: `linear-gradient(135deg, #000000 0%, #1a0030 100%)`,
          padding: "120px 0 80px",
          position: "relative",
          overflow: "hidden",
          transform: 'translate3d(0,0,0)', // Force GPU acceleration
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: 1000
        }}
      >
        {/* Background decorations */}
        <Box
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(67, 97, 238, 0.1) 0%, rgba(67, 97, 238, 0) 70%)",
            filter: "blur(30px)",
            zIndex: 0
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "30%",
            right: "15%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(229, 56, 59, 0.08) 0%, rgba(229, 56, 59, 0) 70%)",
            filter: "blur(20px)",
            zIndex: 0
          }}
        />

        <Container size="lg" style={{ position: "relative", zIndex: 1 }}>
          <Stack align="center" gap="xl" ref={heroRef}>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "#4361ee", to: "#3a0ca3" }}
              style={{ fontWeight: 600 }}
            >
              PRIVACY POLICY
            </Badge>
            
            <Title
              order={1}
              ta="center"
              style={{
                fontSize: "3rem",
                lineHeight: 1.1,
                fontWeight: 500,
                maxWidth: 700
              }}
            >
              <Text inherit component="span" c={theme.white}>
                Your privacy is{" "}
              </Text>
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
              >
                our priority
              </Text>
            </Title>

            <Text
              size="lg"
              c="gray.3"
              ta="center"
              style={{ maxWidth: 600, lineHeight: 1.6 }}
            >
              This Privacy Policy describes how Incoming Class collects, uses, and discloses your information when you use our services. By using our Service, you agree to the collection and use of information in accordance with this policy.
            </Text>

            <Text size="sm" c="gray.5" ta="center">
              Last updated: July 2, 2025
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Privacy Sections */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="lg">
          <Stack gap="xl" ref={sectionsRef}>
            {privacySections.map((section, index) => (
              <Paper
                key={index}
                className="privacy-section"
                p="xl"
                radius="lg"
                style={{
                  background: "linear-gradient(135deg, rgba(67, 97, 238, 0.05) 0%, rgba(58, 12, 163, 0.05) 100%)",
                  border: "1px solid rgba(67, 97, 238, 0.15)",
                  backdropFilter: "blur(5px)", // Reduced blur for better performance
                  WebkitBackdropFilter: "blur(5px)", // iOS support
                  transform: 'translate3d(0,0,0)', // Force GPU acceleration
                  WebkitBackfaceVisibility: 'hidden',
                  WebkitPerspective: 1000
                }}
              >
                <Stack gap="lg">
                  <Group align="center" gap="md" style={{ 
                    flexDirection: "row",
                    justifyContent: "flex-start"
                  }}>
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                    >
                      <section.icon size={20} />
                    </ThemeIcon>
                    <Title 
                      order={2} 
                      c={theme.white} 
                      style={{ 
                        fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                        textAlign: "left"
                      }}
                    >
                      {section.title}
                    </Title>
                  </Group>
                  
                  <Stack gap="sm" style={{ paddingLeft: "0" }}>
                    {section.content.map((item, itemIndex) => (
                      <Group key={itemIndex} align="flex-start" gap="sm">
                        <Box
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: theme.colors.blue[5],
                            marginTop: 6,
                            flexShrink: 0
                          }}
                        />
                        <Text 
                          c="gray.2" 
                          size="md" 
                          style={{ 
                            lineHeight: 1.6,
                            textAlign: "left"
                          }}
                        >
                          {item}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Additional Information */}
      <Box py={60} style={{ backgroundColor: theme.colors.dark[8] }}>
        <Container size="lg">
          <Stack gap="xl">
            <Title
              order={2}
              ta="center"
              c={theme.white}
              style={{ fontSize: "2rem" }}
            >
              Additional Information
            </Title>
            
            <Paper
              p="xl"
              radius="lg"
              style={{
                backgroundColor: theme.colors.dark[9],
                border: `1px solid ${theme.colors.dark[7]}`
              }}
            >
              <Stack gap="lg">
                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Tracking Technologies
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We use browser storage and request headers (e.g., IP address, browser type) to maintain session information, improve service performance, and analyze user behavior. We do not use tracking cookies, web beacons, or flash cookies.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Data Storage and Transfer
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    Your information is securely stored using MongoDB. MongoDB servers may be located internationally. By using the Service, you consent to international data transfer in accordance with this policy. We do not transfer data to any platform without proper safeguards.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Data Retention
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We retain data as long as needed for the purposes listed, to comply with legal obligations, and for internal analytics. If no longer needed, your data will be deleted or anonymized within a reasonable timeframe.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Children's Privacy
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    Our Service is not intended for anyone under 15 years old. We do not knowingly collect data from individuals under 15. If you are a parent or guardian and believe your child provided data, contact us immediately to have it removed.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    External Links
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    Our Service may link to third-party websites. We are not responsible for their privacy policies or practices. Please review their policies before using them.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Disclosure of Personal Data
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We may disclose data to comply with legal obligations, protect the rights or safety of Incoming Class or its users, and prevent or investigate fraud or violations.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Changes to This Policy
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We may update this Privacy Policy periodically. You will be notified via email or a post on our site or Instagram page. Changes are effective once posted.
                  </Text>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box py={60} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="md">
          <Paper
            ref={contactRef}
            p="xl"
            radius="lg"
            ta="center"
            style={{
              background: "linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(229, 56, 59, 0.1) 100%)",
              border: "1px solid rgba(67, 97, 238, 0.2)",
              backdropFilter: "blur(8px)", // Reduced blur for better performance
              WebkitBackdropFilter: "blur(8px)", // iOS support
              transform: 'translate3d(0,0,0)', // Force GPU acceleration
              WebkitBackfaceVisibility: 'hidden',
              WebkitPerspective: 1000
            }}
          >
            <Stack gap="lg">
              <ThemeIcon
                size={50}
                radius="50%"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                mx="auto"
              >
                <IconMail size={24} />
              </ThemeIcon>
              
              <Title order={2} c={theme.white}>
                Questions About Privacy?
              </Title>
              
              <Text c="gray.3" size="lg" maw={400} mx="auto">
                For questions or requests regarding this policy, please contact us at support@incomingclass.com or visit our contact page.
              </Text>
              
              <Group justify="center" gap="md" mt="lg">
                <Anchor
                  href="mailto:support@incomingclass.com"
                  style={{
                    color: theme.colors.blue[4],
                    textDecoration: "none",
                    fontWeight: 600,
                    padding: "12px 24px",
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.blue[5]}`,
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.blue[5];
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = theme.colors.blue[4];
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  support@incomingclass.com
                </Anchor>
                
                <Anchor
                  href="https://incomingclass.com/public/contact"
                  style={{
                    color: theme.colors.blue[4],
                    textDecoration: "none",
                    fontWeight: 600,
                    padding: "12px 24px",
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.blue[5]}`,
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.blue[5];
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = theme.colors.blue[4];
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Contact Page
                </Anchor>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default PrivacyPage; 