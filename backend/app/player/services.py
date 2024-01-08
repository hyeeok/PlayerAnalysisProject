from sqlalchemy.orm import Session
from backend.database.models import Player
from sqlalchemy import func

def get_all_players(db: Session):
    result = db.query(Player).all()
    return result

def get_search_players(category: str, search: str, db: Session):
    "category : player_name, position, nationality, current_team"
    result = (
        db.query(Player)
        .filter(func.lower(getattr(Player, category)).ilike(f"%{search.lower()}%"))
        .all()
    )
    return result

def get_searchs_players(category: str, search1: str, search2: str, db: Session):
    "category : rank, age, market_value"
    result = db.query(Player).filter(getattr(Player, category).between(search1, search2)).all()
    return result
