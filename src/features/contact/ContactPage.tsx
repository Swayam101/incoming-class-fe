import React, { useRef, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Stack,
  Grid,
  Paper,
  useMantineTheme,
  Badge,
  TextInput,
  Textarea,
  Button,
  Select,
} from '@mantine/core';
import { 
  
  
  IconSend,
  IconCheck,
  
  
} from '@tabler/icons-react';
import { useForm, yupResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from '../feed/components/AnimatedBackground';
import { useContact } from '../../hooks/api/useContact';
import { contactSchema, contactInitialValues } from '../../forms';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Support categories
const supportCategories = [
  "General Inquiry",
  "Account Issues", 
  "Profile Setup",
  "Payment & Billing",
  "Technical Support",
  "Partnership/Business",
  "Bug Report",
  "Feature Request"
];


const ContactPage: React.FC = () => {
  const theme = useMantineTheme();
  const { mutateAsync, isPending } = useContact();
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const contactMethodsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const officesRef = useRef<HTMLDivElement>(null);

  // Form handling
  const form = useForm({
    initialValues: contactInitialValues,
    validate: yupResolver(contactSchema)
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const response = await mutateAsync(values);
      
      if (!response.status) throw new Error(response.message);

      notifications.show({
        title: 'Message Sent!',
        message: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 5000,
      });
      
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send message',
        color: 'red',
        autoClose: 5000,
      });
    }
  };

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
          duration: 1.2,
          stagger: 0.25,
          ease: "power2.out",
          clearProps: 'willChange'
        }
      );
    }

    // Contact methods animation - optimized for iOS
    if (contactMethodsRef.current) {
      gsap.fromTo(
        contactMethodsRef.current.querySelectorAll('.contact-method'),
        { 
          y: 30, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: contactMethodsRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          clearProps: 'willChange'
        }
      );
    }

    // Form animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Offices animation
    if (officesRef.current) {
      gsap.fromTo(
        officesRef.current.querySelectorAll('.office-card'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: officesRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, []);

  return (
    <Box style={{ backgroundColor: theme.colors.dark[9], minHeight: "100vh" }}>
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
            top: "15%",
            left: "8%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(67, 97, 238, 0.12) 0%, rgba(67, 97, 238, 0) 70%)",
            filter: "blur(35px)",
            zIndex: 0
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "25%",
            right: "12%",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(229, 56, 59, 0.1) 0%, rgba(229, 56, 59, 0) 70%)",
            filter: "blur(25px)",
            zIndex: 0
          }}
        />

        <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
          <Stack align="center" gap="xl" ref={heroRef}>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "#4361ee", to: "#3a0ca3" }}
              style={{ fontWeight: 600 }}
            >
              GET IN TOUCH
            </Badge>
            
            <Title
              order={1}
              ta="center"
              style={{
                fontSize: "3.5rem",
                lineHeight: 1.1,
                fontWeight: 500,
                maxWidth: 800
              }}
            >
              <Text inherit component="span" c={theme.white}>
                We're here to{" "}
              </Text>
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
              >
                help you succeed
              </Text>
            </Title>

            <Text
              size="xl"
              c="gray.3"
              ta="center"
              style={{ maxWidth: 700, lineHeight: 1.6 }}
            >
              Have questions about IncomingClass? Need support with your profile? 
              We'd love to hear from you and help you make the most of your college journey.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Contact Methods Section */}
      {/* <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="xl">
          <Stack gap="xl" ref={contactMethodsRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                How Can We Help?
              </Title>
              <Text size="lg" c="gray.3" maw={600} mx="auto">
                Choose the best way to reach us based on your needs
              </Text>
            </Box>

            <Grid>
              {contactMethods.map((method, index) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
                  <Paper
                    className="contact-method"
                    component="a"
                    href={method.action}
                    p="xl"
                    radius="lg"
                    h="100%"
                    ta="center"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(5px)", // Reduced blur for better performance
                      WebkitBackdropFilter: "blur(5px)", // iOS support
                      transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                      textDecoration: "none",
                      cursor: "pointer",
                      display: "block",
                      transform: 'translate3d(0,0,0)', // Force GPU acceleration
                      WebkitBackfaceVisibility: 'hidden',
                      WebkitPerspective: 1000,
                      willChange: 'transform, border-color, box-shadow'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate3d(0,-8px,0)';
                      e.currentTarget.style.borderColor = theme.colors.blue[5];
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(67, 97, 238, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate3d(0,0,0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Stack gap="md" align="center">
                      <ThemeIcon
                        size={60}
                        radius="50%"
                        variant="gradient"
                        gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                      >
                        <method.icon size={28} />
                      </ThemeIcon>
                      <Title order={4} c={theme.white}>
                        {method.title}
                      </Title>
                      <Text c="gray.4" size="sm" ta="center">
                        {method.description}
                      </Text>
                      <Text c="blue.4" fw={600} size="sm">
                        {method.value}
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box> */}

      {/* Contact Form Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[8] }}>
        <Container size="md">
          <Stack gap="xl" ref={formRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                Send Us a Message
              </Title>
              <Text size="lg" c="gray.3" maw={500} mx="auto">
                Fill out the form below and we'll get back to you as soon as possible
              </Text>
            </Box>

            <Paper
              p="xl"
              radius="lg"
              style={{
                background: "linear-gradient(135deg, rgba(67, 97, 238, 0.08) 0%, rgba(58, 12, 163, 0.08) 100%)",
                border: "1px solid rgba(67, 97, 238, 0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Full Name"
                        placeholder="Enter your name"
                        {...form.getInputProps('name')}
                        styles={{
                          label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                          input: {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: theme.white,
                            '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                            '&:focus': { borderColor: theme.colors.blue[5] }
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Email Address"
                        placeholder="Enter your email"
                        type="email"
                        {...form.getInputProps('email')}
                        styles={{
                          label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                          input: {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: theme.white,
                            '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                            '&:focus': { borderColor: theme.colors.blue[5] }
                          }
                        }}
                      />
                    </Grid.Col>
                  </Grid>

                  <Select
                    label="Category"
                    placeholder="Select a category"
                    data={supportCategories}
                    {...form.getInputProps('category')}
                    styles={{
                      label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: theme.white,
                        '&:focus': { borderColor: theme.colors.blue[5] }
                      },
                      dropdown: {
                        backgroundColor: theme.colors.dark[8],
                        border: `1px solid ${theme.colors.dark[6]}`
                      },
                      option: {
                        color: theme.white,
                        '&[data-hovered]': { backgroundColor: theme.colors.dark[7] }
                      }
                    }}
                  />

                  <TextInput
                    label="Subject"
                    placeholder="Brief description of your inquiry"
                    {...form.getInputProps('subject')}
                    styles={{
                      label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: theme.white,
                        '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                        '&:focus': { borderColor: theme.colors.blue[5] }
                      }
                    }}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us more about your question or issue..."
                    rows={6}
                    {...form.getInputProps('message')}
                    styles={{
                      label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: theme.white,
                        '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                        '&:focus': { borderColor: theme.colors.blue[5] }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    leftSection={<IconSend size={18} />}
                    loading={isPending}
                    style={{
                      background: "linear-gradient(45deg, #4361ee, #3a0ca3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(67, 97, 238, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {isPending ? "Sending..." : "Send Message"}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Office Locations Section */}
      {/* <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="xl">
          <Stack gap="xl" ref={officesRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                Our Offices
              </Title>
              <Text size="lg" c="gray.3" maw={500} mx="auto">
                Visit us at our locations or reach out remotely
              </Text>
            </Box>

            <Grid>
              {offices.map((office, index) => (
                <Grid.Col span={{ base: 12, sm: 6 }} key={index}>
                  <Paper
                    className="office-card"
                    p="xl"
                    radius="lg"
                    h="100%"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    <Stack gap="md">
                      <Title order={3} c={theme.white}>
                        {office.city}
                      </Title>
                      <Group gap="lg">
                        <Box>
                          <Text fw={600} c={theme.white} mb="xs">
                            Address
                          </Text>
                          <Text c="gray.4" style={{ whiteSpace: 'pre-line' }}>
                            {office.address}
                          </Text>
                        </Box>
                        <Box>
                          <Text fw={600} c={theme.white} mb="xs">
                            Office Hours
                          </Text>
                          <Text c="gray.4" style={{ whiteSpace: 'pre-line' }}>
                            {office.hours}
                          </Text>
                        </Box>
                      </Group>
                    </Stack>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box> */}
    </Box>
  );
};

export default ContactPage; 