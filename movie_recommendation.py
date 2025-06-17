import json
import random
from typing import Dict, List, Any

def get_movie_recommendations(emotion: str, language: str) -> Dict[str, Any]:
    """
    Get movie recommendations based on emotion and language
    """
    try:
        # URL mappings for different languages and genres
        url_mappings = {
            "telugu": {
                "drama": "https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=te",
                "action": "https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=te",
                "comedy": "https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=te",
                "horror": "https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=te",
                "crime": "https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=te",
                "fantasy": "https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=te",
                "thriller": "https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=te",
                "romance": "https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=te"
            },
            "english": {
                "drama": "https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=en",
                "action": "https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=en",
                "comedy": "https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=en",
                "horror": "https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=en",
                "crime": "https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=en",
                "fantasy": "https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=en",
                "thriller": "https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=en",
                "romance": "https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=en"
            },
            "hindi": {
                "drama": "https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=hi",
                "action": "https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=hi",
                "comedy": "https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=hi",
                "horror": "https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=hi",
                "crime": "https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=hi",
                "fantasy": "https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=hi",
                "thriller": "https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=hi",
                "romance": "https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=hi"
            },
            "tamil": {
                "drama": "https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=ta",
                "action": "https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=ta",
                "comedy": "https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=ta",
                "horror": "https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=ta",
                "crime": "https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=ta",
                "fantasy": "https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=ta",
                "thriller": "https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=ta",
                "romance": "https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=ta"
            },
            "malayalam": {
                "drama": "https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=ml",
                "action": "https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=ml",
                "comedy": "https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=ml",
                "horror": "https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=ml",
                "crime": "https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=ml",
                "fantasy": "https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=ml",
                "thriller": "https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=ml",
                "romance": "https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=ml"
            },
            "kannada": {
                "drama": "https://www.imdb.com/search/title/?title_type=feature&genres=drama&languages=ka",
                "action": "https://www.imdb.com/search/title/?title_type=feature&genres=action&languages=ka",
                "comedy": "https://www.imdb.com/search/title/?title_type=feature&genres=comedy&languages=ka",
                "horror": "https://www.imdb.com/search/title/?title_type=feature&genres=horror&languages=ka",
                "crime": "https://www.imdb.com/search/title/?title_type=feature&genres=crime&languages=ka",
                "fantasy": "https://www.imdb.com/search/title/?title_type=feature&genres=fantasy&languages=ka",
                "thriller": "https://www.imdb.com/search/title/?title_type=feature&genres=thriller&languages=ka",
                "romance": "https://www.imdb.com/search/title/?title_type=feature&genres=romance&languages=ka"
            }
        }

        # Movie templates for different genres and languages
        movie_templates = {
            "drama": {
                "english": ["The Pursuit of Happiness", "A Beautiful Mind", "Forrest Gump", "The Shawshank Redemption", "Good Will Hunting"],
                "hindi": ["Taare Zameen Par", "Dangal", "Pink", "Anand", "Mughal-E-Azam"],
                "telugu": ["Baahubali", "Arjun Reddy", "Mahanati", "Jersey", "Sita Ramam"],
                "tamil": ["Kaaka Muttai", "Visaranai", "Asuran", "Pariyerum Perumal", "Vada Chennai"],
                "malayalam": ["Drishyam", "Kumbakonam Gopals", "Maheshinte Prathikaaram", "Angamaly Diaries", "Thondimuthalum Driksakshiyum"],
                "kannada": ["Kirik Party", "Lucia", "Ulidavaru Kandanthe", "Thithi", "Ondu Motteya Kathe"]
            },
            "action": {
                "english": ["Mad Max: Fury Road", "John Wick", "The Dark Knight", "Avengers: Endgame", "Mission: Impossible"],
                "hindi": ["War", "Pathaan", "Baaghi", "Dhoom", "Krrish"],
                "telugu": ["RRR", "Pushpa", "Saaho", "Baahubali 2", "Ala Vaikunthapurramuloo"],
                "tamil": ["Master", "Vikram", "Beast", "Bigil", "Sarkar"],
                "malayalam": ["Lucifer", "Big Brother", "Pulimurugan", "Abrahaminte Santhathikal", "The Great Father"],
                "kannada": ["KGF", "Roberrt", "Avane Srimannarayana", "Hebbuli", "The Villain"]
            },
            "comedy": {
                "english": ["The Hangover", "Superbad", "Anchorman", "Dumb and Dumber", "Borat"],
                "hindi": ["Hera Pheri", "Andaz Apna Apna", "Munna Bhai MBBS", "Golmaal", "3 Idiots"],
                "telugu": ["F2: Fun and Frustration", "Venky Mama", "Hello Guru Prema Kosame", "Bhale Bhale Magadivoy", "Pelli Choopulu"],
                "tamil": ["Soodhu Kavvum", "Naduvula Konjam Pakkatha Kaanom", "Kaththi Sandai", "Comali", "Doctor"],
                "malayalam": ["In Harihar Nagar", "Ramji Rao Speaking", "Godha", "Kattappanayile Rithwik Roshan", "Maheshinte Prathikaaram"],
                "kannada": ["Kirik Party", "Chamak", "Googly", "Lifeu Ishtene", "Gultoo"]
            },
            "horror": {
                "english": ["The Conjuring", "Hereditary", "Get Out", "A Quiet Place", "The Babadook"],
                "hindi": ["Stree", "Tumhari Sulu", "Pari", "Raaz", "Bhoot"],
                "telugu": ["Awe!", "Gruham", "Raju Gari Gadhi", "Prema Katha Chitram", "Geethanjali"],
                "tamil": ["Demonte Colony", "Yaamirukka Bayamey", "Pisaasu", "Maya", "Aval"],
                "malayalam": ["Ezra", "Pretham", "Bhoothakaalam", "Anveshanam", "Chathur Mukham"],
                "kannada": ["Shivalinga", "Aake", "Karvva", "Mummy: Save Me", "Namo Bhootatma"]
            },
            "crime": {
                "english": ["The Godfather", "Goodfellas", "Pulp Fiction", "Scarface", "The Departed"],
                "hindi": ["Gangs of Wasseypur", "Sacred Games", "Mirzapur", "Scam 1992", "Mumbai Saga"],
                "telugu": ["Kshanam", "Goodachari", "Agent Sai Srinivasa Athreya", "HIT", "V"],
                "tamil": ["Vikram Vedha", "Kaithi", "Theeran Adhigaaram Ondru", "Ratsasan", "Pizza"],
                "malayalam": ["Mumbai Police", "Memories", "CBI Series", "Joseph", "Anjaam Pathiraa"],
                "kannada": ["Tagaru", "Birbal Trilogy", "Kavaludaari", "Kanoora Heggadati", "Aa Karaala Ratri"]
            },
            "fantasy": {
                "english": ["The Lord of the Rings", "Harry Potter", "Pan's Labyrinth", "The Shape of Water", "Life of Pi"],
                "hindi": ["Haider", "Tumhari Sulu", "Brahmastra", "Koi... Mil Gaya", "Mr. India"],
                "telugu": ["Eega", "Magadheera", "Arundhati", "Yamadonga", "Annamayya"],
                "tamil": ["Enthiran", "7aum Arivu", "I", "Kochadaiiyaan", "Maayavan"],
                "malayalam": ["Manichithrathazhu", "Bhramaram", "Kummatty", "My Dear Kuttichathan", "Athbhutha Dweepu"],
                "kannada": ["Upendra", "A", "Super", "Shiva Mechida Kannappa", "Apthamitra"]
            },
            "thriller": {
                "english": ["Se7en", "Zodiac", "Gone Girl", "Shutter Island", "The Silence of the Lambs"],
                "hindi": ["Kahaani", "Talaash", "Drishyam", "Te3n", "Badla"],
                "telugu": ["Kshanam", "Evaru", "Goodachari", "Agent Sai Srinivasa Athreya", "HIT"],
                "tamil": ["Ratsasan", "Thani Oruvan", "Yennai Arindhaal", "Dhuruvangal Pathinaaru", "Kuttram 23"],
                "malayalam": ["Drishyam", "Memories", "Forensic", "Anjaam Pathiraa", "The Great Indian Kitchen"],
                "kannada": ["Kavaludaari", "U Turn", "Aa Karaala Ratri", "Birbal Trilogy", "Kanoora Heggadati"]
            },
            "romance": {
                "english": ["The Notebook", "Titanic", "Casablanca", "When Harry Met Sally", "La La Land"],
                "hindi": ["Dilwale Dulhania Le Jayenge", "Kuch Kuch Hota Hai", "Jab We Met", "Zindagi Na Milegi Dobara", "Yeh Jawaani Hai Deewani"],
                "telugu": ["Geetha Govindam", "Arjun Reddy", "Ninnu Kori", "Tholi Prema", "Fidaa"],
                "tamil": ["96", "Vinnaithaandi Varuvaayaa", "Alaipayuthey", "Kaadhal", "OK Kanmani"],
                "malayalam": ["Premam", "Bangalore Days", "Ustad Hotel", "Charlie", "Ennu Ninte Moideen"],
                "kannada": ["Mungaru Male", "Googly", "Milana", "Gaalipata", "Chamak"]
            }
        }

        # Normalize inputs
        emotion_lower = emotion.lower()
        language_lower = language.lower()

        # Get URL
        url = ""
        if language_lower in url_mappings and emotion_lower in url_mappings[language_lower]:
            url = url_mappings[language_lower][emotion_lower]

        # Get movies
        movies = []
        if emotion_lower in movie_templates and language_lower in movie_templates[emotion_lower]:
            base_movies = movie_templates[emotion_lower][language_lower]
            additional_movies = [
                f"New {emotion} Release 2024",
                f"Classic {emotion} Film",
                f"Award Winning {emotion} Movie",
                f"Popular {emotion} Cinema",
                f"Blockbuster {emotion} Hit"
            ]
            movies = base_movies + additional_movies
            # Add some randomization
            random.shuffle(movies)
            movies = movies[:25 + random.randint(0, 15)]
        else:
            # Fallback movies
            movies = [
                f"Popular {emotion} movie in {language}",
                f"Best {emotion} film",
                f"Top rated {emotion} movie",
                f"Classic {emotion} cinema",
                f"Award winning {emotion} film"
            ]

        return {
            "emotion": emotion,
            "language": language,
            "url": url,
            "movies": movies,
            "count": len(movies)
        }

    except Exception as e:
        return {
            "error": f"Failed to get movie recommendations: {str(e)}"
        }

if __name__ == "__main__":
    # Test the function
    result = get_movie_recommendations("action", "english")
    print(json.dumps(result, indent=2))