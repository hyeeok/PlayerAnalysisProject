from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.DBConn import Base
from datetime import datetime

class Player(Base):
    __tablename__ = "players"

    rank = Column(Integer, primary_key=True, index=True)
    player_name = Column(String)
    position = Column(String)
    age = Column(Integer)
    nationality = Column(String)
    current_team = Column(String)
    market_value = Column(Integer)

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    id = Column(String(50), unique=True, nullable=False)

class UserSecurityInfo(Base):
    __tablename__ = "users_security_info"

    user_security_info_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    password = Column(String(255), nullable=False)
    salt = Column(String(255), nullable=False)
    user = relationship("User", back_populates="security_info")

class UserProfileInfo(Base):
    __tablename__ = "users_profile_info"

    user_profile_info_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    address = Column(String(255))
    phone_number = Column(String(20))
    user = relationship("User", back_populates="profile_info")

User.security_info = relationship("UserSecurityInfo", back_populates="user")
User.profile_info = relationship("UserProfileInfo", back_populates="user")