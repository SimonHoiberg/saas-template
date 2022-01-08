import Head from 'next/head';
import { Box, Heading, Container, Text, Button, Stack, createIcon, Center, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useGetUser } from '../hooks/useSyncUser';
import Link from 'next/link';

export default function Home() {
  const { getUser, getUserData, getUserLoading, getUserError } = useGetUser();

  useEffect(() => {
    getUser();
  }, []);

  if (getUserError) {
    console.error(getUserError);

    return (
      <Center w="100vw" h="100vh">
        <Text color={'gray.500'}>Something went wrong :(</Text>
      </Center>
    );
  }

  if (getUserLoading || !getUserData) {
    return (
      <Center w="100vw" h="100vh">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>SaaS Setup</title>
        <meta name="description" content="Created by Simon Hoiberg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW={'3xl'}>
        <Stack as={Box} textAlign={'center'} spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
          <Heading fontWeight={600} fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }} lineHeight={'110%'}>
            Welcome,
            <Text as={'span'} ml="2" color={'green.400'}>
              {getUserData.username}
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            This is the home page of your SaaS. You are now signed in, and you can start doing... whatever you are here
            to do 🙌
            <br />
            <br />
            Remember to like the <Link href="">GitHub repo</Link> and give Simon a like on YouTube.
          </Text>
          <Stack direction={'column'} spacing={3} align={'center'} alignSelf={'center'} position={'relative'}>
            <Button
              colorScheme={'green'}
              bg={'green.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'green.500',
              }}
            >
              Get Started
            </Button>
            <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
