from typing import List
from pydantic import BaseModel

class Player(BaseModel):
    rank: int
    player_name: str
    position: str
    age: int
    nationality: str
    current_team: str
    market_value: str

class PlayerList(BaseModel):
    length: int
    data: List[Player]