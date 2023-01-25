import { Text, Box, Button, SimpleGrid, Heading, Card, CardHeader, CardBody, CardFooter, useToast } from '@chakra-ui/react'
import { useAccount, useContract, useSigner } from 'wagmi';
import { useEventProvider } from '@/context/EventContext';

const MyJob = () => {
    const { getEvents, events, contractAddress, Contract } = useEventProvider()
    const { address, isConnected } = useAccount()
    const toast = useToast()
    const { data: signer } = useSigner()
    const contract = useContract({
        address: contractAddress,
        abi: Contract.abi,
        signerOrProvider: signer
    })

    const handlePay = async (id) => {
        try {

            let transaction = await contract.setIsFinishedAndPay(id)
            await transaction.wait(1) //= wait(1) même chose
            getEvents()
            toast({
                title: 'Congratulations!',
                description: "You get this job",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
        catch (e) {
            toast({
                title: 'Error',
                description: e.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return (
        <Box>
            <Heading>My dashboard</Heading>
            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {events.map(event =>
                (event.author === address &&
                    <Card key={event.id}>
                        <CardHeader>
                            <Heading size='md'> {address.substring(0, 5)}...{address.substring(address.length - 4)}</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>{event.description}</Text>
                        </CardBody>
                        <CardFooter>
                            {event.isFinished ? <Text color="red">Job is finished</Text> : (event.worker == undefined ? '' : (<Button colorScheme="red" onClick={() => handlePay(event.id)}>Pay</Button>))}
                        </CardFooter>
                    </Card>
                )
                )}
            </SimpleGrid>
        </Box>
    );
};

export default MyJob;