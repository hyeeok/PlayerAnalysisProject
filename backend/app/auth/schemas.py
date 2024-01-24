from pydantic import BaseModel


class User(BaseModel):
    id: str
    password: str


class ProfileInfo(User):
    address: str
    phone_number: str

class SessionId(BaseModel):
    session_id: str

class UserId(BaseModel):
    id: str

class Email(BaseModel):
    email:str