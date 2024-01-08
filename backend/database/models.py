from sqlalchemy import Column, String, Integer
from backend.database.DBConn import Base

class Player(Base):
    __tablename__ = "players"

    rank = Column(Integer, primary_key=True, index=True)
    player_name = Column(String)
    position = Column(String)
    age = Column(Integer)
    nationality = Column(String)
    current_team = Column(String)
    market_value = Column(Integer)
