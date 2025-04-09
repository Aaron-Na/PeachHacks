def calculate_match_percentage(user_artists, other_user_artists):
    """
    user_artists: List of 5 artist names for the current user
    other_user_artists: List of 5 artist names for another user
    Returns: match percentage as an integer
    """
    score = 0
    max_score = 15  # 5 + 4 + 3 + 2 + 1, assuming positional weight

    for i, artist in enumerate(user_artists):
        if artist in other_user_artists:
            # Weighted score: match at position 0 (top artist) is worth 5 points, and so on
            score += 5 - i

    return int((score / max_score) * 100)

def find_best_match(current_user_id, users_data):
    """
    current_user_id: ID of the user to match
    users_data: Dictionary or list of all user objects with 'id' and 'top_artists' keys
    Returns: Best match user object and match percentage
    """
    current_user = next(user for user in users_data if user['id'] == current_user_id)
    current_artists = current_user['top_artists']

    best_match = None
    best_percentage = -1

    for user in users_data:
        if user['id'] == current_user_id:
            continue
        percentage = calculate_match_percentage(current_artists, user['top_artists'])
        if percentage > best_percentage:
            best_percentage = percentage
            best_match = user

    return best_match, best_percentage
 
 
users = [
    {"id": 1, "username": "Alice", "top_artists": ["Drake", "SZA", "Bad Bunny", "Frank Ocean", "Kendrick Lamar"]},
    {"id": 2, "username": "Bob", "top_artists": ["SZA", "Frank Ocean", "Tyler, The Creator", "Kanye West", "Doja Cat"]},
    {"id": 3, "username": "Charlie", "top_artists": ["Taylor Swift", "Beyoncé", "Adele", "Olivia Rodrigo", "Lana Del Rey"]}
]

best_match, match_percent = find_best_match(1, users)
print(f"Best match for Alice: {best_match['username']} ({match_percent}%)")
