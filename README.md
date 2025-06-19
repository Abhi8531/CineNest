# 🎬 CineNest - Your Ultimate Cinema Discovery Platform

CineNest is a modern, feature-rich cinema discovery platform that helps you explore movies and TV shows with intelligent recommendations, personal watchlists, and comprehensive entertainment information. **Your data is automatically saved locally using IP-based identification - no backend server required!**

## ✨ Key Features

- 🎯 **Smart Recommendations** - Personalized movie suggestions based on your viewing history
- 📝 **Personal Watchlist** - Save movies and shows to watch later
- ⭐ **Favorites Collection** - Keep track of your all-time favorite content
- 🎪 **Custom Collections** - Create themed playlists for different moods and genres
- 💾 **IP-based Local Storage** - Your data is automatically saved locally using your IP address
- 🎨 **Dark/Light Themes** - Beautiful UI with theme customization
- 🔍 **Advanced Search** - Filter by genre, year, rating, and more
- 📱 **Mobile Responsive** - Optimized for all devices
- 🎬 **Trending Content** - Discover what's popular right now
- 🎭 **Detailed Information** - Comprehensive movie and TV show details

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CineNest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up your environment variables**
   Create a `.env` file in the root directory:

   ```env
   REACT_APP_ACCESS_TOKEN=your_tmdb_access_token_here
   ```

   Get your TMDB API token from: https://www.themoviedb.org/settings/api

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 💾 Data Storage

CineNest uses an innovative **IP-based local storage system**:

- Your data is automatically saved to your browser's local storage
- Each user is identified by their IP address for data separation
- No backend server required - everything runs client-side
- Data includes watchlist, favorites, collections, and preferences
- Automatic migration from legacy storage formats

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with Hooks
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Data Source**: TMDB (The Movie Database) API
- **Storage**: IP-based Local Storage
- **Icons**: React Icons & Lucide React

## 📁 Project Structure

```
CineNest/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Main application pages
│   ├── services/         # API and storage services
│   ├── store/            # Redux store and slices
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── assets/           # Static assets
├── public/               # Public assets
└── package.json          # Dependencies and scripts
```

## 🌟 Features in Detail

### 🎬 Movie Discovery

- Browse trending movies and TV shows
- Search with advanced filters
- Genre-based exploration
- Detailed cast and crew information

### 📝 Personal Management

- Watchlist for movies you want to see
- Favorites for content you loved
- Custom collections with themes
- Viewing history tracking

### 💾 Smart Storage

- IP-based user identification
- Automatic data persistence
- Seamless experience across sessions
- Privacy-focused (no personal data collection)

### 🎨 User Experience

- Responsive design for all devices
- Dark and light theme options
- Smooth animations and transitions
- Intuitive navigation

## 🔧 Environment Variables

| Variable                 | Description           | Required |
| ------------------------ | --------------------- | -------- |
| `REACT_APP_ACCESS_TOKEN` | TMDB API Access Token | Yes      |

## 📱 Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the amazing frontend library
