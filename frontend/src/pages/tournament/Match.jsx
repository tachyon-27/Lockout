import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const Match = () => {

    const { toast } = useToast();

    const [searchParams] = useSearchParams()
    const matchId = searchParams.get('match')
    const tournamentId = searchParams.get('tournament')

    const navigate = useNavigate()

    const [problemList, setProblemList] = useState()

    useEffect(() => {

        if(!matchId || !tournamentId) {
            toast({
                title: "Match or Tournament not specified!"
            })
            navigate('/tournaments')
        }

        try {

            const getProblemList = async () => {
                const response = await axios.get('/api/cf/get-problem-list', {
                    tournamentId,
                    matchId,
               })

               if(!response.data.success === 'OK') {
                toast({
                    title: "Error Fetching questions!"
                })
                console.log(response.data);
                navigate('/tournaments')
               }

                setProblemList(response.data.data);

            }
            
            getProblemList()

        } catch (error) {
            console.error(error);
            
            toast({
                title: "Error!"
            })

            navigate('/tournaments')

        }
    }, [toast, tournamentId, matchId, navigate])

    const onSubmit = async () => {
        try {
            await axios.get('/api/cf/update-match-problems', {
                tournamentId,
                matchId,
            })
        } catch (error) {
            console.error(error);
            toast({
                title: "Error Updating problem Status!",
            })
        }
    }

    // useEffect(() => {
    //     socket.on("problemListUpdated", (data) => {
    //         if(data.matchId === matchId) {
    //             setProblemList(data.problemList);
    //         } else {
    //             console.log("Event Emmited to wrong room!")
    //         }
    //     })

    //     return () => {
    //         socket.off("problemListUpdated");
    //     }

    // }, []);


  return (
    <div>Match</div>
  )
}

export default Match