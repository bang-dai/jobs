import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

const Footer = () => {
    return (
        <Flex h="15vh" p="2rem" justifyContent="center" alignItems="center">
            <Text>&copy; Find your job {new Date().getFullYear()}</Text>
        </Flex>
    );
};

export default Footer;