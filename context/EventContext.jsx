import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Contract from '../Jobs.json'
import { useAccount, useProvider } from "wagmi";

const EventContext = React.createContext(null)

export function useEventProvider() {
    const context = useContext(EventContext)

    if (!context) {
        throw new Error('useEventProvider must be used within a EventProvider')
    }
    return context
}

export const EventProvider = ({ children }) => {
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const { address, isConnected } = useAccount()
    const provider = useProvider()
    const [events, setEvents] = useState([])

    useEffect(() => {
        if (isConnected) {
            getEvents()
        }
    }, [isConnected, address])

    const getEvents = async () => {
        let filter = {
            address: contractAddress,
            fromBlock: process.env.NEXT_PUBLIC_BLOCK
        };

        const contract = new ethers.Contract(contractAddress, Contract.abi, provider)
        let myEvents = []
        let blocks = await contract.queryFilter(filter)

        for await (const block of blocks) {
            if (block.event === "jobAdded") {
                myEvents.push({
                    "id": block.args.id.toString(),
                    'author': block.args.author,
                    'worker': block.args.worker,
                    'description': block.args.description,
                    'price': ethers.utils.formatEther(block.args.price),
                    'isFinished': block.args.isFinished
                })
            }
            if (block.event === "jobTaken") {
                let index = myEvents.findIndex(t => t.id === block.args.id.toString())
                myEvents[index].worker = block.args.worker
            }
            if (block.event === "jobIsFinishedAndPaid") {
                let index = myEvents.findIndex(t => t.id === block.args.id.toString())
                myEvents[index].isFinished = true
            }
        }
        setEvents(myEvents)
    }

    return (
        <EventContext.Provider value={{ getEvents, events, contractAddress, Contract }}>
            {children}
        </EventContext.Provider>
    )
}

export default EventContext