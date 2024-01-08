from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.DBConn import get_db
from . import services
from .schemas import Player

router = APIRouter(prefix="/player")

@router.get("", response_model=Player)
async def read_players(db: Session = Depends(get_db)):
    result = services.get_all_players(db=db)
    for player in result:
        player.market_value = f"€{player.market_value:.2f}m"
    response = {"length": len(result), "data": result}
    return response

@router.get("/{category}/{search}", response_model=Player)
async def read_search_players(category: str, search: str, db: Session = Depends(get_db)):
    result = services.get_search_players(category=category, search=search, db=db)
    for player in result:
        player.market_value = f"€{player.market_value:.2f}m"
    response = {"length": len(result), "data": result}
    return response

@router.get("/{category}/{search1}/{search2}", response_model=Player)
async def read_searchs_players(category: str, search1: str, search2: str, db: Session = Depends(get_db)):
    result = services.get_searchs_players(category=category, search1=search1, search2=search2, db=db)
    for player in result:
        player.market_value = f"€{player.market_value:.2f}m"
    response = {"length": len(result), "data": result}
    return response
