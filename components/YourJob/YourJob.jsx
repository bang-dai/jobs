import { Text, Box, Button, SimpleGrid, Heading, Card, CardHeader, CardBody, CardFooter, Spinner, Toast, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'
import { useEventProvider } from '@/context/EventContext'



const YourJob = () => {
    const [isLoading, setLoading] = useState(false)
    const { getEvents, events, contractAddress, Contract } = useEventProvider()
    const { address, isConnected } = useAccount()
    const toast = useToast()
    const { data: signer } = useSigner()
    const contract = useContract({
        address: contractAddress,
        abi: Contract.abi,
        signerOrProvider: signer
    })

    const handleTakeJob = async (id) => {
        try {
            setLoading(true)

            let transaction = await contract.takeJob(id)
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
        setLoading(false)
    }

    return (
        <Box>
            <Heading>Jobs request</Heading>
            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {events.map(event =>
                (event.author !== address &&
                    <Card key={event.id}>
                        <CardHeader>
                            <Heading size='md'> {event.author.substring(0, 5)}...{event.author.substring(event.author.length - 4)}</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>{event.description}</Text>
                        </CardBody>
                        <CardFooter>
                            {event.isFinished ? 'Job is finished' : (event.worker == undefined ? <Button colorScheme="green" onClick={() => handleTakeJob(event.id)}>{isLoading ? (<Spinner />) : ('Work')}</Button> : <Text color="green">Job taken</Text>)}
                        </CardFooter>
                    </Card>
                )
                )}
            </SimpleGrid>
        </Box>
    );
};

export default YourJob;