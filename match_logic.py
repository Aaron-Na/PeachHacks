#caclulates match percentage between two users based on their top artists
def calculate_match_percentage(user_artists, other_user_artists):
    score = 0
    max_score = 15  # 5 + 4 + 3 + 2 + 1, assuming positional weight

    for i, artist in enumerate(user_artists):
        if artist in other_user_artists:
            # Weighted score: match at position 0 (top artist) is worth 5 points, and so on
            score += 5 - i

    return int((score / max_score) * 100)

#finds best match for a user based on their top artists
def find_best_match(current_user_id, users_data):
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