import Stack from "@mui/material/Stack";
import GenreItem from "../ItemComponents/GenreItem";
import SectionTitle from '../DescriptionComponents/SectionTitle';

const TopGenres = ({ topGenres }) => {
    const TOP_GENRES_LABEL = `Your Top ${topGenres.length} Genres 📕`
    const TOP_GENRES_FOOTER = `Your top genres are determined by looking at your top 50 artists from the chosen time period and looking at 
    the genres associated with each artist.`

    return (
        <Stack className="padding-1-rem">

            {/* TOP GENRES TITLE */}
            <SectionTitle title={TOP_GENRES_LABEL} />

            {/* TOP GENRES ITEMS */}
            <Stack direction="row" justifyContent="center">

                {/* 1ST COLUMN OF TOP GENRES LIST */}
                <div>
                    {
                        topGenres.slice(0,5).map((item, index) => <GenreItem item={item} index={index} />)
                    }
                </div>

                {/* 2ND COLUMN OF TOP GENRES LIST */}
                <div>
                    {
                        topGenres.slice(5,10).map((item, index) => <GenreItem item={item} index={index+5} />)
                    }
                </div>

            </Stack>

            {/* TOP GENRES FOOTER */}
            <small className="small-desc-lightgrey text-align-center">
                {TOP_GENRES_FOOTER}
            </small>

        </Stack>
    )
}

export default TopGenres;