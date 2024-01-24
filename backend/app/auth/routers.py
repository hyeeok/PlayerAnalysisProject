from fastapi import APIRouter, Body, Cookie, Depends, HTTPException, Header, Response
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database.DBConn import get_db
from . import services
from .schemas import *
import secrets
from fastapi.security import OAuth2PasswordBearer
import random
import redis
import os

router = APIRouter(prefix="/auth")

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=os.getenv("MAIL_PORT"),  
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS"),
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS"),
    USE_CREDENTIALS=os.getenv("USE_CREDENTIALS")
)

redis_client = redis.Redis(host='localhost', port=6379)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def generate_session_id():
    session_id = secrets.token_hex(32)
    return session_id

@router.post("/send_verification_code")
async def send_verification_code(email: Email):
    verification_code = ''.join(str(random.randint(0, 9)) for _ in range(6))
    
    message = MessageSchema(
        subtype="plain",
        subject="SPAP 본인인증코드",
        recipients=[email.email],  
        body=f"Verification code : {verification_code}"
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    return verification_code


@router.post("/fetch_user_name")
async def fetch_user_name(session_id: SessionId):
    user_name = redis_client.get(session_id.session_id)  # Redis에서 세션 ID에 해당하는 사용자 이름 조회
    if user_name is not None: 
        return user_name.decode('utf-8')
    else:
        raise HTTPException(status_code=404, detail="사용자 이름을 찾을 수 없습니다.")


@router.post("/logout")
async def logout_user(session_id: SessionId, response: Response):
    try:
        redis_client.delete(session_id.session_id)
        response.delete_cookie("session_id")
        return {"message": "로그아웃되었습니다."}
    except Exception as e:
        print(f"{str(e)}")
        raise HTTPException(status_code=500, detail=f"세션 삭제 실패: {str(e)}")


@router.post("/login", response_model=str)
def login_user(user: User, db: Session = Depends(get_db)):
    try:
        result = services.login_user(user, db=db)
        if result:
            # 세션 식별자 생성
            session_id = generate_session_id()

            # Redis에 세션 정보 저장
            redis_client.set(session_id, result)

            response_data = {"message": "로그인 성공", "session_id": session_id, "id": result}
            response = JSONResponse(content=response_data)
            response.set_cookie(key='session_id', value=session_id)
            return response
        else:
            raise HTTPException(status_code=401, detail="로그인 실패")

    except Exception as e:
        print(repr(e))
        raise e

@router.post("/register", response_model=str)
def register_user(profile_info: ProfileInfo, db: Session = Depends(get_db)):
    try:
        services.register_user(profile_info, db=db)
        return f"id : {profile_info.id} - 회원가입 완료"

    except Exception as e:
        print(repr(e))
        raise e


@router.delete("/delete", response_model=str)
def delete_user(user: User, db: Session = Depends(get_db)):
    try:
        result = services.delete_user(user, db=db)
        if result:
            return f"id : {user.id} - 삭제 완료"
        else:
            return f"id : {user.id} - 삭제 실패"

    except Exception as e:
        print(repr(e))
        raise e


@router.post("/check_id")
async def check_id_availability(id: UserId , db: Session = Depends(get_db)):
    is_available = services.check_id_availability(id.id, db)
    return {"available": is_available}