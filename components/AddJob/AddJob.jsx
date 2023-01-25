import { Flex, Box, Button, Input, Heading, useToast, Spinner, Textarea, SimpleGrid, Center } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { ethers } from 'ethers';
import { useAccount, useBalance, useSigner } from 'wagmi';
import { useEventProvider } from '@/context/EventContext';

const AddJob = () => {
    const { getEvents, contractAddress, Contract } = useEventProvider()
    const toast = useToast()
    const { address, isConnected } = useAccount()
    const { data: signer } = useSigner()
    const { data, isError, isLoading } = useBalance({
        address: address,
        watch: true
    })
    const inputDesc = useRef(null)
    const inputPrice = useRef(null)

    const handleAdd = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let transaction = await contract.addJob(inputDesc.current.value, { value: ethers.utils.parseEther(inputPrice.current.value) })
            await transaction.wait() //= wait(1) même chose
            getEvents()
            toast({
                title: 'Congratulations!',
                description: "Your job is added",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
        catch (e) {
            toast({
                title: 'Error',
                description: "An error occured, please try again...",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return (
        <SimpleGrid columns={1} spacing={10}>
            <Center justifyContent="center">
                <Heading>Add a job</Heading>
            </Center>
            <Center justifyContent="center">
                <Textarea placeholder='The description of the job' ref={inputDesc} />
            </Center>
            <Center>
                <Input placeholder='How much you will pay your worker in ETH' ref={inputPrice} />
            </Center>
            <Center>
                <Button colorScheme="purple" onClick={handleAdd}>Add</Button>
            </Center>
        </SimpleGrid >
    );
};

export default AddJob;