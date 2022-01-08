import { Center, Box, FormControl, FormLabel, Input, Stack, Link, Button, Heading, Text } from '@chakra-ui/react';
import { Auth } from 'aws-amplify';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Signin: NextPage = () => {
  const [confirmationCode, setConfirmationCode] = useState({ value: '', isValid: true });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleConfirmUser = async () => {
    if (!confirmationCode) {
      setConfirmationCode({ value: '', isValid: false });
      return;
    }

    setIsLoading(true);

    if (typeof window === 'undefined') {
      return;
    }

    const email = localStorage.getItem('pending_verification_email');

    if (!email) {
      return;
    }

    try {
      await Auth.confirmSignUp(email, confirmationCode.value);
      localStorage.removeItem('pending_verification_email');
      router.push('/signin');
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <Center w="100vw" h="100vh" bg={'gray.50'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Confirm your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Check your email. We sent you a code.
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <FormControl id="confirmation_code">
              <FormLabel>Confirmation code</FormLabel>
              <Input
                type="text"
                value={confirmationCode.value}
                onChange={(e) => setConfirmationCode({ value: e.target.value, isValid: true })}
                isInvalid={!confirmationCode.isValid}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                isLoading={isLoading}
                color={'white'}
                onClick={handleConfirmUser}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Confirm
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Center>
  );
};

export default Signin;
