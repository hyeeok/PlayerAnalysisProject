from fastapi import APIRouter, Cookie, Depends, HTTPException, Header, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database.DBConn import get_db
from . import services
from .schemas import *
import secrets
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/auth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def generate_session_id():
    session_id = secrets.token_hex(32)
    return session_id

def get_session_id(session_id: str = Header(None)):
    return session_id

@router.get("/header_login_info")
async def login_info(session_id: str = Cookie(None), db: Session = Depends(get_db)):
    result = services.get_user_id_by_session_id(session_id=session_id, db=db)
    return {"user_id": result}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("cookie_name")
    return {"message": "로그아웃되었습니다."}

@router.post("/login", response_model=str)
def login_user(user: User, session_id: str = Depends(get_session_id), db: Session = Depends(get_db)):
    try:
        result = services.login_user(user, db=db)
        if result:
            if session_id is None:
                session_id = generate_session_id()  # 세션 식별자 생성
                user_session = UserSession(session_id=session_id, id=user.id)
                services.save_session(user_session, db)

            response_data = {"message": "로그인 성공", "session_id": session_id}
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
