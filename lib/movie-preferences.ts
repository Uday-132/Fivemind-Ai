// Server-side cookie handling will be done in API routes

export interface MoviePreferences {
  favoriteGenres: string[]
  preferredLanguages: string[]
  minRating: number
  preferredYearRange: {
    from: number
    to: number
  }
  watchedMovies: string[]
  likedMovies: string[]
  dislikedMovies: string[]
  preferredDirectors: string[]
  lastUpdated: string
}

export interface MovieFilters {
  year_from?: number
  year_to?: number
  min_rating?: number
  sort?: 'popularity' | 'rating' | 'year' | 'title'
  genres?: string[]
}

export interface EnhancedMovie {
  title: string
  year: string
  rating: string
  genres: string[]
  plot: string
  director: string
  duration: string
  imdb_url: string
  poster_url?: string
  trailer_url?: string
  enhanced?: boolean
  personalizedScore?: number
}

export interface MovieRecommendationResponse {
  emotion: string
  language: string
  url: string
  movies: EnhancedMovie[]
  count: number
  enhanced: boolean
  filters_applied: MovieFilters
  personalized?: boolean
  recommendations_reason?: string[]
}

const DEFAULT_PREFERENCES: MoviePreferences = {
  favoriteGenres: [],
  preferredLanguages: ['english'],
  minRating: 6.0,
  preferredYearRange: {
    from: 2000,
    to: new Date().getFullYear()
  },
  watchedMovies: [],
  likedMovies: [],
  dislikedMovies: [],
  preferredDirectors: [],
  lastUpdated: new Date().toISOString()
}

// Server-side preferences manager (for API routes)
export class ServerMoviePreferencesManager {
  private static COOKIE_NAME = 'movie_preferences'

  static getPreferencesFromCookies(cookieHeader?: string): MoviePreferences {
    if (!cookieHeader) return DEFAULT_PREFERENCES
    
    try {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = decodeURIComponent(value)
        return acc
      }, {} as Record<string, string>)
      
      const prefCookie = cookies[this.COOKIE_NAME]
      if (prefCookie) {
        const preferences = JSON.parse(prefCookie)
        return { ...DEFAULT_PREFERENCES, ...preferences }
      }
    } catch (error) {
      console.error('Error reading preferences from cookies:', error)
    }
    
    return DEFAULT_PREFERENCES
  }

  static createPreferencesCookie(preferences: Partial<MoviePreferences>): string {
    const updated = {
      ...DEFAULT_PREFERENCES,
      ...preferences,
      lastUpdated: new Date().toISOString()
    }
    
    const cookieValue = encodeURIComponent(JSON.stringify(updated))
    const maxAge = 365 * 24 * 60 * 60 // 1 year
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
    
    return `${this.COOKIE_NAME}=${cookieValue}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
  }

  static addToHistory(preferences: MoviePreferences, movie: EnhancedMovie, action: 'viewed' | 'liked' | 'disliked'): MoviePreferences {
    const updated = { ...preferences }
    
    switch (action) {
      case 'viewed':
        if (!updated.watchedMovies.includes(movie.title)) {
          updated.watchedMovies.push(movie.title)
        }
        break
      case 'liked':
        if (!updated.likedMovies.includes(movie.title)) {
          updated.likedMovies.push(movie.title)
          updated.dislikedMovies = updated.dislikedMovies.filter(m => m !== movie.title)
          movie.genres.forEach(genre => {
            if (!updated.favoriteGenres.includes(genre.toLowerCase())) {
              updated.favoriteGenres.push(genre.toLowerCase())
            }
          })
          if (movie.director && !updated.preferredDirectors.includes(movie.director)) {
            updated.preferredDirectors.push(movie.director)
          }
        }
        break
      case 'disliked':
        if (!updated.dislikedMovies.includes(movie.title)) {
          updated.dislikedMovies.push(movie.title)
          updated.likedMovies = updated.likedMovies.filter(m => m !== movie.title)
        }
        break
    }
    
    return updated
  }

}

export class MoviePreferencesManager {
  static calculatePersonalizedScore(movie: EnhancedMovie, preferences: MoviePreferences): number {
    let score = 0
    
    // Genre matching (40% weight)
    const genreMatches = movie.genres.filter(genre => 
      preferences.favoriteGenres.includes(genre.toLowerCase())
    ).length
    score += (genreMatches / Math.max(movie.genres.length, 1)) * 40
    
    // Director preference (20% weight)
    if (preferences.preferredDirectors.includes(movie.director)) {
      score += 20
    }
    
    // Rating preference (20% weight)
    const movieRating = parseFloat(movie.rating) || 0
    if (movieRating >= preferences.minRating) {
      score += 20
    }
    
    // Year preference (10% weight)
    const movieYear = parseInt(movie.year) || 0
    if (movieYear >= preferences.preferredYearRange.from && 
        movieYear <= preferences.preferredYearRange.to) {
      score += 10
    }
    
    // Penalty for disliked movies
    if (preferences.dislikedMovies.includes(movie.title)) {
      score -= 50
    }
    
    // Bonus for similar movies to liked ones
    if (preferences.likedMovies.length > 0) {
      // Simple similarity based on shared genres
      score += 10
    }
    
    return Math.max(0, Math.min(100, score))
  }

  static generateRecommendationReasons(movie: EnhancedMovie, preferences: MoviePreferences): string[] {
    const reasons: string[] = []
    
    const genreMatches = movie.genres.filter(genre => 
      preferences.favoriteGenres.includes(genre.toLowerCase())
    )
    
    if (genreMatches.length > 0) {
      reasons.push(`Matches your favorite genres: ${genreMatches.join(', ')}`)
    }
    
    if (preferences.preferredDirectors.includes(movie.director)) {
      reasons.push(`Directed by ${movie.director}, one of your preferred directors`)
    }
    
    const movieRating = parseFloat(movie.rating) || 0
    if (movieRating >= preferences.minRating) {
      reasons.push(`High rating (${movie.rating}) meets your minimum preference`)
    }
    
    if (preferences.likedMovies.length > 0) {
      reasons.push('Similar to movies you\'ve liked before')
    }
    
    return reasons
  }
}

// Client-side utilities
export const clientPreferencesManager = {
  getPreferences: (): MoviePreferences => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES
    
    try {
      const stored = localStorage.getItem('movie_preferences')
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('Error reading client preferences:', error)
    }
    
    return DEFAULT_PREFERENCES
  },

  savePreferences: (preferences: Partial<MoviePreferences>): void => {
    if (typeof window === 'undefined') return
    
    try {
      const current = clientPreferencesManager.getPreferences()
      const updated = {
        ...current,
        ...preferences,
        lastUpdated: new Date().toISOString()
      }
      
      localStorage.setItem('movie_preferences', JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving client preferences:', error)
    }
  },

  addToHistory: (movie: EnhancedMovie, action: 'viewed' | 'liked' | 'disliked'): void => {
    const preferences = clientPreferencesManager.getPreferences()
    
    switch (action) {
      case 'viewed':
        if (!preferences.watchedMovies.includes(movie.title)) {
          preferences.watchedMovies.push(movie.title)
        }
        break
      case 'liked':
        if (!preferences.likedMovies.includes(movie.title)) {
          preferences.likedMovies.push(movie.title)
          preferences.dislikedMovies = preferences.dislikedMovies.filter(m => m !== movie.title)
          movie.genres.forEach(genre => {
            if (!preferences.favoriteGenres.includes(genre.toLowerCase())) {
              preferences.favoriteGenres.push(genre.toLowerCase())
            }
          })
          if (movie.director && !preferences.preferredDirectors.includes(movie.director)) {
            preferences.preferredDirectors.push(movie.director)
          }
        }
        break
      case 'disliked':
        if (!preferences.dislikedMovies.includes(movie.title)) {
          preferences.dislikedMovies.push(movie.title)
          preferences.likedMovies = preferences.likedMovies.filter(m => m !== movie.title)
        }
        break
    }
    
    clientPreferencesManager.savePreferences(preferences)
  }
}