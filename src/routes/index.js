import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ExplorePage from "../pages/ExplorePage";
import DetailsPage from "../pages/DetailsPage";
import SearchPage from "../pages/SearchPage";
import WatchlistPage from "../pages/WatchlistPage";
import CollectionsPage from "../pages/CollectionsPage";
import FavoritesPage from "../pages/FavoritesPage";
import { RouterErrorBoundary } from "../components/ErrorBoundary";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <RouterErrorBoundary />,
        children: [
            {
                path: "",
                element: <Home/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "watchlist",
                element: <WatchlistPage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "favorites",
                element: <FavoritesPage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "collections",
                element: <CollectionsPage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "ratings",
                element: <WatchlistPage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "movie",
                element: <ExplorePage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "tv",
                element: <ExplorePage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "trending",
                element: <ExplorePage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "coming-soon",
                element: <ExplorePage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "top-rated",
                element: <ExplorePage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "awards",
                element: <ExplorePage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: ":explore",
                element: <ExplorePage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: ":explore/:id",
                element: <DetailsPage/>,
                errorElement: <RouterErrorBoundary />
            },
            {
                path: "search",
                element: <SearchPage/>,
                errorElement: <RouterErrorBoundary />
            }
        ]
    }
])

export default router