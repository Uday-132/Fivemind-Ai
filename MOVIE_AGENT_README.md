# Movie Recommendation Agent

## Overview
The Movie Recommendation Agent is a specialized AI agent that helps users discover movies based on their current mood/genre preferences and preferred language. It scrapes real-time data from IMDb to provide up-to-date movie recommendations.

## Features
- **Mood-Based Recommendations**: Choose from 8 different genres/emotions
- **Multi-Language Support**: Supports 6 languages including regional Indian cinema
- **Real-time Data**: Fetches fresh movie data from IMDb
- **Interactive UI**: Beautiful, responsive interface with mood and language selection
- **Export Functionality**: Download recommendations as markdown files

## Supported Genres
- Drama 🎭
- Action 💥
- Comedy 😂
- Horror 👻
- Crime 🔍
- Fantasy 🧙
- Thriller ⚡
- Romance 💕

## Supported Languages
- English 🇺🇸
- Telugu 🇮🇳
- Hindi 🇮🇳
- Tamil 🇮🇳
- Malayalam 🇮🇳
- Kannada 🇮🇳

## Technical Implementation

### Frontend (`/app/agents/movie/page.tsx`)
- Built with Next.js 14 and React
- Uses Tailwind CSS for styling
- Implements Framer Motion for animations
- Features responsive grid layouts for genre and language selection
- Includes loading states and error handling

### Backend (`/app/api/agents/movie/route.ts`)
- Next.js API route handling POST requests
- Integrates with Python script for web scraping
- Includes fallback mock data system
- Implements proper error handling and logging

### Python Script (`/movie_recommendation.py`)
- Web scraping using BeautifulSoup and requests
- Handles multiple language-specific IMDb URLs
- Cleans movie titles (removes duplicates, empty strings, and serial numbers)
- Includes error handling and data validation
- Exports reusable functions for integration

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Required Python packages (see requirements.txt)

### Python Dependencies
```bash
pip install -r requirements.txt
```

Required packages:
- requests==2.31.0
- beautifulsoup4==4.12.2
- lxml==4.9.3
- pandas==2.1.4
- matplotlib==3.8.2

### Usage
1. Navigate to `/agents/movie` in the application
2. Select your current mood/genre from the available options
3. Choose your preferred language
4. Click "Get Recommendations" to fetch movies
5. Browse the results and optionally download the list

## API Endpoints

### POST `/api/agents/movie`
Fetches movie recommendations based on emotion and language.

**Request Body:**
```json
{
  "emotion": "action",
  "language": "english"
}
```

**Response:**
```json
{
  "emotion": "action",
  "language": "english",
  "url": "https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=en",
  "movies": ["Movie 1", "Movie 2", ...],
  "count": 25,
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

## File Structure
```
/app/agents/movie/
├── page.tsx                 # Movie agent UI component
/app/api/agents/movie/
├── route.ts                 # API endpoint for movie recommendations
/movie_recommendation.py     # Python web scraping script
/requirements.txt           # Python dependencies
```

## Error Handling
- Graceful fallback to mock data if Python script fails
- User-friendly error messages for invalid inputs
- Proper HTTP status codes and error responses
- Loading states during data fetching

## Contributing
When adding new features or languages:
1. Update the URL mappings in both Python script and API route
2. Add new language/genre options to the frontend constants
3. Update mock data generators for fallback scenarios
4. Test thoroughly with different combinations

## Notes
- The agent respects IMDb's robots.txt and implements proper request headers
- Rate limiting is handled through request delays
- The system gracefully handles network failures and parsing errors
- All movie data is sourced from IMDb and updated in real-time