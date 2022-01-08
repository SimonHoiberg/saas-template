import {
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useState } from 'react';
import NextLink from 'next/link';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';

const Signup: NextPage = () => {
  const [firstName, setFirstName] = useState({ value: '', isValid: true });
  const [lastName, setLastName] = useState({ value: '', isValid: true });
  const [email, setEmail] = useState({ value: '', isValid: true });
  const [password, setPassword] = useState({ value: '', isValid: true });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const setInput =
    (setter: (inp: { value: string; isValid: boolean }) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter({ value: e.target.value, isValid: true });
    };

  const handleSignUp = async () => {
    if (!firstName.value) {
      setFirstName({ value: '', isValid: false });
      return;
    }

    if (!lastName.value) {
      setLastName({ value: '', isValid: false });
      return;
    }

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
      await Auth.signUp({
        username: email.value,
        password: password.value,
        attributes: {
          email: email.value,
          name: `${firstName.value} ${lastName.value}`,
        },
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('pending_verification_email', email.value);
      }

      router.push('/confirm');
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <Center w="100vw" h="100vh" bg={'gray.50'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    value={firstName.value}
                    onChange={setInput(setFirstName)}
                    isInvalid={!firstName.isValid}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    value={lastName.value}
                    onChange={setInput(setLastName)}
                    isInvalid={!lastName.isValid}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email.value} onChange={setInput(setEmail)} isInvalid={!email.isValid} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type="password"
                  value={password.value}
                  onChange={setInput(setPassword)}
                  isInvalid={!password.isValid}
                />
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                isLoading={isLoading}
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSignUp}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user?{' '}
                <NextLink href="/signin">
                  <Link color={'blue.400'}>Login</Link>
                </NextLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Center>
  );
};

export default Signup;
