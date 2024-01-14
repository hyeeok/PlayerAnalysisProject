from pydantic import BaseModel


class User(BaseModel):
    id: str
    password: str


class ProfileInfo(User):
    address: str
    phone_number: str

class UserSession(BaseModel):
    session_id: str
    id: str