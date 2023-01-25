import { Flex, Text, Box, Heading } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

const Header = () => {
    return (
        <Flex h="15vh" p="2rem" justifyContent="space-between" alignItems="center">
            <Text>Mini Job DApp</Text>
            <Flex
                direction={{ base: 'column', xl: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                width="25%"
            >
                <Link href="/">Home</Link>
                {/* <Link href="/addjob">Add a Job</Link> */}
            </Flex>
            <ConnectButton />
        </Flex>

    )
}

export default Header