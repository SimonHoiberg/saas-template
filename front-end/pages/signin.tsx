import {
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Auth } from 'aws-amplify';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Signin: NextPage = () => {
  const [email, setEmail] = useState({ value: '', isValid: true });
  const [password, setPassword] = useState({ value: '', isValid: true });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const setInput =
    (setter: (inp: { value: string; isValid: boolean }) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter({ value: e.target.value, isValid: true });
    };

  const handleSignIn = async () => {
    if (!email.value) {
      setEmail({ value: '', isValid: false });
      return;
    }

    if (!password.value) {
      setPassword({ value: '', isValid: false });
      return;
    }

    setIsLoading(true);

    try {
      await Auth.signIn({ username: email.value, password: password.value });
      router.push('/');
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <Center w="100vw" h="100vh" bg={'gray.50'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Don&apos;t have a user? Go and{' '}
            <NextLink href="/signup">
              <Link color={'blue.400'}>sign up</Link>
            </NextLink>{' '}
            ✌️
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email.value} onChange={setInput(setEmail)} isInvalid={!email.isValid} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password.value}
                onChange={setInput(setPassword)}
                isInvalid={!password.isValid}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                isLoading={isLoading}
                onClick={handleSignIn}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Center>
  );
};

export default Signin;
