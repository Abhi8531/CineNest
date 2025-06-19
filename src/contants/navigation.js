import { MdHomeFilled, MdFavorite, MdWatchLater } from "react-icons/md";
import { PiTelevisionFill } from "react-icons/pi";
import { BiSolidMoviePlay, BiCollection } from "react-icons/bi";
import { IoSearchOutline, IoTrophyOutline } from "react-icons/io5";
import { FiTrendingUp, FiCalendar, FiStar } from "react-icons/fi";

export const navigation = [
    {
        label: "Movies",
        href: "movie",
        icon: <BiSolidMoviePlay/>
    },
    {
        label: "TV Shows",
        href: 'tv',
        icon: <PiTelevisionFill/>
    },
    {
        label: "Trending",
        href: "trending",
        icon: <FiTrendingUp/>
    },
    {
        label: "Coming Soon",
        href: "coming-soon",
        icon: <FiCalendar/>
    },
    {
        label: "Top Rated",
        href: "top-rated",
        icon: <FiStar/>
    },
    {
        label: "Awards",
        href: "awards",
        icon: <IoTrophyOutline/>
    }
]

export const mobileNavigation = [
    {
        label: "Home",
        href: "/",
        icon: <MdHomeFilled/>
    },
    {
        label: "Movies",
        href: "/movie",
        icon: <BiSolidMoviePlay/>
    },
    {
        label: "TV Shows",
        href: "/tv",
        icon: <PiTelevisionFill/>
    },
    {
        label: "Watchlist",
        href: "/watchlist",
        icon: <MdWatchLater/>
    },
    {
        label: "Search",
        href: "/search",
        icon: <IoSearchOutline/>
    }
]

export const userNavigation = [
    {
        label: "Watchlist",
        href: "/watchlist",
        icon: <MdWatchLater/>
    },
    {
        label: "Favorites",
        href: "/favorites",
        icon: <MdFavorite/>
    },
    {
        label: "Collections",
        href: "/collections",
        icon: <BiCollection/>
    }
]