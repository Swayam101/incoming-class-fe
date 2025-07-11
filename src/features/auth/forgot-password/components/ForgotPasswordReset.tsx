import React, { useState } from 'react'
import { 
  Button, 
  Text, 
  Box,
  Title,
  Alert,
  PinInput,
  PasswordInput,
  Group,
  Stack,
  Container
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import classes from './ForgotPassword.module.scss'
import { IconArrowLeft, IconCheck, IconLock } from '@tabler/icons-react'
import { useResetPassword } from '../../../../hooks/api'
import { showError, showSuccess } from '../../../../utils'
import { resetPasswordSchema } from '../../../../forms/schemas/auth.schemas'
import { resetPasswordInitialValues } from '../../../../forms/initialValues/auth.initialValues'
import { useMediaQuery } from '@mantine/hooks'

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ForgotPasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [resetComplete, setResetComplete] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 576px)');
  
  // Get email from URL parameters or localStorage
  const email = searchParams.get('email') || localStorage.getItem('resetEmail') || '';
  
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  
  // Initialize Mantine form with validation
  const form = useForm<ResetPasswordFormValues>({
    initialValues: resetPasswordInitialValues,
    validate: yupResolver(resetPasswordSchema),
  });
  
  const otpError = otp.length > 0 && otp.length < 6 
    ? 'Verification code must be 6 digits' 
    : null;
  
  const isFormValid = 
    otp.length === 6 && 
    form.isValid() &&
    email.length > 0;
  
  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    if (otp.length !== 6) {
      showError('Please enter a valid 6-digit verification code');
      return;
    }
    
    try {
      const response = await resetPassword({
        email,
        otp,
        password: values.password
      });
      
      if (response.status) {
        setResetComplete(true);
        showSuccess('Password reset successfully! Redirecting to login...');
        localStorage.removeItem('resetEmail');
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to reset password. Please try again.';
      showError(errorMessage);
    }
  };
  
  // If no email is available, redirect back to request page
  React.useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);
  
  return (
    <Container size="xs" px={isMobile ? "xs" : "sm"} py={isMobile ? "md" : "xl"}>
      <Box className={classes.formContainer}>
        <form onSubmit={form.onSubmit(handleResetPassword)} style={{ width: '100%' }}>
          <Stack gap={isMobile ? "md" : "lg"}>
            <Box>
              <Link to="/forgot-password">
                <Text 
                  fz={{ base: "14px", md: "16px" }} 
                  fw={500} 
                  c="#4361ee"
                  className={classes.linkText}
                >
                  <IconArrowLeft size={16} />
                  Back to reset request
                </Text>
              </Link>
              <Title order={3} mb="sm" mt="md" className={classes.formTitle}>Reset Your Password</Title>
              <Text size="sm" className={classes.formText} mb="lg">
                Enter the verification code sent to <strong>{email}</strong> and create a new password.
              </Text>
            </Box>
            
            {resetComplete ? (
              <Alert 
                icon={<IconCheck size={16} />} 
                title="Password Reset Complete" 
                color="green" 
                radius="md"
              >
                Your password has been successfully reset. You will be redirected to the login page shortly.
              </Alert>
            ) : (
              <Stack gap={isMobile ? "md" : "lg"}>
                <Box>
                  <Text className={classes.label} component="label" htmlFor="otp">
                    Verification Code
                  </Text>
                  <Group justify="center" mt="xs">
                    <PinInput 
                      id="otp"
                      length={6} 
                      size={isMobile ? "sm" : "md"}
                      radius="md"
                      value={otp}
                      onChange={setOtp}
                      inputMode="numeric"
                      oneTimeCode
                      aria-label="Verification code"
                      classNames={{ input: classes.input }}
                      error={!!otpError}
                    />
                  </Group>
                  {otpError && (
                    <Text size="sm" c="red" mt="xs" ta="center">
                      {otpError}
                    </Text>
                  )}
                </Box>
                
                <PasswordInput 
                  classNames={{ label: classes.label, input: classes.input }} 
                  label="New Password" 
                  placeholder="Enter new password"
                  radius="md"
                  size={isMobile ? "sm" : "md"}
                  leftSection={<IconLock size={16} />}
                  {...form.getInputProps('password')}
                />
                
                <PasswordInput 
                  classNames={{ label: classes.label, input: classes.input }} 
                  label="Confirm Password" 
                  placeholder="Confirm new password"
                  radius="md"
                  size={isMobile ? "sm" : "md"}
                  leftSection={<IconLock size={16} />}
                  {...form.getInputProps('confirmPassword')}
                />
                
                <Button 
                  type="submit"
                  color="#4361ee"
                  radius="md"
                  size={isMobile ? "md" : "lg"}
                  fullWidth
                  loading={isPending}
                  className={classes.primaryButton}
                  disabled={!isFormValid}
                >
                  Reset Password
                </Button>
              </Stack>
            )}
            
            <Box style={{ marginTop: isMobile ? '12px' : '16px', textAlign: 'center' }}>
              <Text size="sm" className={classes.formText}>
                Remember your password?{' '}
                <Link to="/login">
                  <Text 
                    component="span" 
                    fz={{ base: "14px", md: "14px" }} 
                    fw={600} 
                    c="#4361ee"
                    className={classes.linkText}
                  >
                    Log in
                  </Text>
                </Link>
              </Text>
            </Box>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPasswordReset; 