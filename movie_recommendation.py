import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
URLST = {
    "drama": 'https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=te',
    "action": 'https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=te',
    "comedy": 'https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=te',
    "horror": 'https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=te',
    "crime": 'https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=te',
    "fantasy":'https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=te',
    "thriller":'https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=te',
    "romance":'https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=te'
}
URLSE={
    "drama":'https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=en',
    "action":'https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=en',
    "comedy":'https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=en',
    "horror":'https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=en',
    "crime":'https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=en',
    "fantasy":'https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=en',
    "thriller":'https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=en',
    "romance":'https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=en',
    }
URLSH={
    "drama":'https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=hi',
    "action":'https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=hi',
    "comedy":'https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=hi',
    "horror":'https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=hi',
    "crime":'https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=hi',
    "fantasy":'https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=hi',
    "thriller":'https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=hi',
    "romance":'https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=hi',
    }
URLSK={
    "drama":'https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=ka',
    "action":'https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=ka',
    "comedy":'https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=ka',
    "horror":'https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=ka',
    "crime":'https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=ka',
    "fantasy":'https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=ka',
    "thriller":'https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=ka',
    "romance":'https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=ka',
    }
URLSTA={
    "drama":'https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=ta',
    "action":'https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=ta',
    "comedy":'https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=ta',
    "horror":'https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=ta',
    "crime":'https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=ta',
    "fantasy":'https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=ta',
    "thriller":'https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=ta',
    "romance":'https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=ta',
    }
URLSM={
    "drama":'https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=ml',
    "action":'https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=ml',
    "comedy":'https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=ml',
    "horror":'https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=ml',
    "crime":'https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=ml',
    "fantasy":'https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=ml',
    "thriller":'https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=ml',
    "romance":'https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=ml',
    }

def get_movie_recommendations(emotion, language):
    """
    Get movie recommendations based on emotion/genre and language
    """
    # Fix the typo in horror for English and Hindi URLs
    if language == 'english':
        url_dict = URLSE.copy()
        url_dict['horror'] = 'https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=en'
        url = url_dict.get(emotion.lower())
    elif language == 'telugu':
        url = URLST.get(emotion.lower())
    elif language == "hindi":
        url_dict = URLSH.copy()
        url_dict['horror'] = 'https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=hi'
        url = url_dict.get(emotion.lower())
    elif language == "tamil":
        url = URLSTA.get(emotion.lower())
    elif language == "malayalam":
        url = URLSM.get(emotion.lower())
    elif language == "kannada":
        url = URLSK.get(emotion.lower())
    else:
        return {"error": "Invalid language. Supported languages: english, telugu, hindi, tamil, malayalam, kannada"}
    
    if not url:
        return {"error": "Invalid emotion/genre. Supported genres: drama, action, comedy, horror, crime, fantasy, thriller, romance"}
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  
    except requests.RequestException as e:
        return {"error": f"Error fetching data: {e}"}
    
    soup = BeautifulSoup(response.text, "lxml")    
    titles = [a.get_text() for a in soup.find_all('a', href=re.compile(r'/title/tt\d+/'))]
    
    # Clean titles: remove empty strings, duplicates, and serial numbers
    cleaned_titles = []
    for title in titles:
        title = title.strip()
        if title:  # Skip empty strings
            # Remove serial numbers like "1. ", "2. ", etc.
            cleaned_title = re.sub(r'^\d+\.\s*', '', title)
            if cleaned_title and cleaned_title not in cleaned_titles:
                cleaned_titles.append(cleaned_title)
    
    # Limit to 40 movies
    unique_titles = cleaned_titles[:40]
    
    return {
        "emotion": emotion,
        "language": language,
        "url": url,
        "movies": unique_titles,
        "count": len(unique_titles)
    }

def main(emotion, language):
    """
    Main function for backward compatibility
    """
    result = get_movie_recommendations(emotion, language)
    if "error" in result:
        print(result["error"])
        return []
    
    print(f"{emotion} Movies\nlink --- {result['url']}")
    return result["movies"]

if __name__ == '__main__':
    print("The Emotions are: ")
    print("Drama\nAction\nComedy\nHorror\nCrime\nFantasy\nThriller\nRomance")
    emotion = input("Enter the emotion: ").strip()
    print("1.Telugu\n2.Hindi\n3.English\n4.Tamil\n5.Kannada\n6.Malayalam")
    language = input("Enter the language: ").strip()
    movie_titles = main(emotion, language)
    
    if not movie_titles:
        print("No titles found.... ")
    else:
        max_titles = 40 if emotion in ["Drama", "Action", "Comedy", "Horror", "Crime", "fantasy", "Thriller", "Romance"] else 40
        for title in movie_titles[:max_titles]:
            print(title)