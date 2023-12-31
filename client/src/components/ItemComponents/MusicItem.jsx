import Stack from "@mui/material/Stack";

const removeParanthesesRegex = /\([^()]*\)/g

const MusicItem = ({ item, index }) => {

    return (
        <Stack alignItems="center" className="music-container" key={index+1}>

            {/* TRACK IMAGE & HYPERLINK*/}
            <div>
                <a className="spotify-hyperlink" href={item.external_urls.spotify}>
                    <img className="album-alt" src={item.album.images[1].url} alt="Album" />
                </a>
            </div>

            {/* TRACK DETAILS */}
            <Stack alignItems="center" justifyContent="center">
                <p className="text-align-center">#{index+1}</p>
                <h3 className="text-align-center">{item.name.replace(removeParanthesesRegex, '')}</h3>
                <p className="text-align-center">{item.artists.slice(0,2).map(artist => artist.name).join(', ')}</p>
            </Stack>

        </Stack>
    )
}

export default MusicItem;