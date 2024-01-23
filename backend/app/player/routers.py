from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from database.DBConn import get_db
from . import services
from .schemas import *

router = APIRouter(prefix="")

@router.get("/player", response_model=PlayerList)
async def read_players(db: Session = Depends(get_db)):
    result = services.get_all_players(db=db)
    for player in result:
        player.market_value = f"€{player.market_value:.2f}m"
    response = {"length": len(result), "data": result}
    return response

@router.get("/player/image")
async def get_player_image(rank: int, player_name: str):
    print(rank)
    print(player_name)
    # 이미지 파일 경로를 생성 (images 디렉토리에 저장되어 있다고 가정)
    image_path = f"database/player_images/{rank}_{player_name}.jpg"

    try:
        with open(image_path, "rb"):
            return FileResponse(image_path, media_type="image/jpeg")
    except FileNotFoundError:
        # 해당 선수의 이미지가 없을 경우 404 에러 반환
        raise HTTPException(status_code=404, detail="Player image not found")
    

# @router.get("/player/{category}/{search}", response_model=PlayerList)
# async def read_search_players(category: str, search: str, db: Session = Depends(get_db)):
#     result = services.get_search_players(category=category, search=search, db=db)
#     for player in result:
#         player.market_value = f"€{player.market_value:.2f}m"
#     response = {"length": len(result), "data": result}
#     return response

# @router.get("/player/{category}/{search1}/{search2}", response_model=PlayerList)
# async def read_searchs_players(category: str, search1: str, search2: str, db: Session = Depends(get_db)):
#     result = services.get_searchs_players(category=category, search1=search1, search2=search2, db=db)
#     for player in result:
#         player.market_value = f"€{player.market_value:.2f}m"
#     response = {"length": len(result), "data": result}
#     return response
