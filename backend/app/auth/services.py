from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from .schemas import *
import bcrypt


# 무작위 솔트를 생성하는 함수
def generate_salt() -> str:
    return bcrypt.gensalt().decode()


# 비밀번호를 해싱하는 함수
def hash_password(password: str, salt: str) -> str:
    hashed_password = bcrypt.hashpw(password.encode(), salt.encode())
    return hashed_password.decode()

#session_id -> user_id
def get_user_id_by_session_id(session_id: str, db: Session):
    query = text(
        """
        SELECT user_id FROM sessions WHERE session_id = :session_id
        """
    )
    
    result = db.execute(query, {"session_id": session_id}).fetchone()
    if result:
        user_id = result[0]
        return user_id
    return None

#세션 db 저장
def save_session(user_session: UserSession, db: Session):
    query = text(
        """
        INSERT INTO sessions (session_id, user_id, login_time)
        VALUES (:session_id, :user_id, :login_time)
        """
    )
    
    db.execute(
        query,
        {
            "session_id": user_session.session_id,
            "user_id": user_session.id,
            "login_time": datetime.utcnow(), 
        },
    )
    db.commit()

# 로그인
def login_user(user: User, db: Session):
    query = text(
        """
            SELECT user_id, password, salt
            FROM users_security_info
            WHERE user_id = (
                SELECT user_id FROM users WHERE id = :id
            )
            """
    )
    security_info = db.execute(query, {"id": user.id}).fetchone()

    if security_info:
        user_id, stored_password, salt = security_info

        hashed_input_password = bcrypt.hashpw(user.password.encode(), salt.encode())

        if hashed_input_password.decode() == stored_password:
            return user.id
        else:
            return None

    else:
        return None

# 회원가입
def register_user(profile_info: ProfileInfo, db: Session):
    try:
        query_1 = text(
            """
            INSERT INTO users (id)
            VALUES (:id)
            """
        )
        db.execute(query_1, {"id": profile_info.id})

        query_2 = text(
        """
        SELECT user_id FROM users WHERE id = :id
        """
        )

        # FK인 user_id를 얻기 위한
        result = db.execute(query_2, {"id": profile_info.id}).fetchone()
        fk_user_id = result[0]

        query_3 = text(
            """
            INSERT INTO users_profile_info (user_id, address, phone_number)
            VALUES (:user_id, :address, :phone_number)
            """
        )
        db.execute(
            query_3,
            {
                "user_id": fk_user_id,
                "address": profile_info.address,
                "phone_number": profile_info.phone_number,
            },
        )

        # 해쉬화된 salt 번호와 비밀번호 생성
        salt = generate_salt()
        hashed_password = hash_password(profile_info.password, salt)

        query_4 = text(
            """
            INSERT INTO users_security_info (user_id, password, salt)
            VALUES (:user_id, :password, :salt)
            """
        )
        db.execute(
            query_4,
            {
                "user_id": fk_user_id,
                "password": hashed_password,
                "salt": salt,
            },
        )

        db.commit()

    except Exception as e:
        print(repr(e))
        db.rollback()
        raise e


# 계정 삭제
def delete_user(user: User, db: Session):
    try:
        query = text(
            """
                SELECT user_id, password, salt
                FROM users_security_info
                WHERE user_id = (
                    SELECT user_id FROM users WHERE id = :id
                )
                """
        )
        security_info = db.execute(query, {"id": user.id}).fetchone()

        if security_info:
            user_id, stored_password, salt = security_info

            hashed_input_password = bcrypt.hashpw(user.password.encode(), salt.encode())

            if hashed_input_password.decode() == stored_password:
                query = text(
                    """
                        DELETE FROM users WHERE user_id = :user_id
                        """
                )
                db.execute(query, {"user_id": user_id})
                db.commit()

                return user.id
            else:
                return None

        else:
            return None

    except Exception as e:
        print(repr(e))
        db.rollback()
        raise e
