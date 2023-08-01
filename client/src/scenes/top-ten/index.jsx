import { useContext } from "react";
import TopArtistGenres from "./sections/TopArtistsGenres";
import TopUserSongs from "./sections/TopUserSongs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { TimeRangeContext } from "../../contexts/TimeRangeContext";
import TimeRadioGroup from "../../components/FunctionalComponents/TimeRadioGroup";
import TwinkleStarsAnimation from "../../components/BackgroundComponents/TwinkleStarsAnimation";

const TopTensOverview = () => {
    const timeContext = useContext(TimeRangeContext)

    const { data: topArtistsData, isLoading: isTopArtistsLoading, refetch: refetchTopArtists } = useQuery(["topArtists"], () => {
        return axios.get(`/api/spotify/top-artists?timeRange=${timeContext.timeRange}`, { withCredentials: true }).then((res) => res.data.items)
        // return axios.get(`http://localhost:5000/api/spotify/top-artists?timeRange=${timeContext.timeRange}`, { withCredentials: true }).then((res) => res.data.items)
    })

    const { data: topTracksData, isLoading: isTopTracksLoading, refetch: refetchTopTracks } = useQuery(["topTracks"], () => {
        return axios.get(`/api/spotify/top-tracks?timeRange=${timeContext.timeRange}`, { withCredentials: true }).then((res) => res.data.items)
        // return axios.get(`http://localhost:5000/api/spotify/top-tracks?timeRange=${timeContext.timeRange}`, { withCredentials: true }).then((res) => res.data.items)
    })

    const handleTimeChange = async (event, newTimeRange) => {
        await timeContext.changeTimeRange(newTimeRange)

        try {
            refetchTopArtists()
            refetchTopTracks()
        } catch (error) {
            window.location.href = '/home'
        }
    }

    if (isTopArtistsLoading || isTopTracksLoading) {
        return (
        <div className="flex-background">
            {/* BACKGROUND ANIMATION */}
            <TwinkleStarsAnimation />
        </div>)
    }

    return (
        <div className="flex-background">

            {/* BACKGROUND ANIMATION */}
            <TwinkleStarsAnimation />

            {/* TIME RADIO GROUP BUTTONS */}
            <TimeRadioGroup handleTimeChange={handleTimeChange}/>

            {/* TOP ARTISTS & GENRES SECTION - OVERVIEW */}
            <TopArtistGenres data={topArtistsData}/>
            {/* TOP USER SONGS SECTIONS - OVERVIEW */}
            <TopUserSongs data={topTracksData} />

        </div>
    )
}

export default TopTensOverview;