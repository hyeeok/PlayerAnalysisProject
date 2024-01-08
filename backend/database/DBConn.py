import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# 데이터베이스 연결 정보 읽기
SQLALCHEMY_DATABASE_URL = os.getenv("DB_URL") or ""

# SQLAlchemy 엔진 생성
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 데이터베이스 연결 상태 확인
try:
    engine.connect()
    print("Database connected successfully!")
except Exception as e:
    print(f"Error connecting to the database: {e}")
    exit()

# 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
