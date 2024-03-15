# 축구선수 정보를 보여주고, 더해서 이들의 스텟을 분석할 수 있는 페이지

### 사용 기술
* backend - FastAPI
* db - postgreSQL, Redis
* frontend - React

DB의 경우, 사용자의 경험을 향상시킬 수 있도록 상황에 맞춰서 아키텍처를 구현.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
** 환경 세팅 **

#사용 전 docker hub을 활용하여 이미지 가져오기
        docker pull hyeeok/spap:backend
        docker pull hyeeok/spap:postgres-alpine

1. 도커 컴포즈 파일 주석 해제 및 환경 변수 설정 후, docker-compose up -d --build 를 활용하여 프로젝트 이미지 생성 및 컨테이너 생성

2. alembic 을 활용하여 테이블 자동 생성
        #스크립트 생성
        alembic revision --autogenerate -m "create players table”
        #DB로 테이블 정보 업데이트
        alembic upgrade head 

#크롤링 전에 models.py 의 3번 줄 수정
from database.DBConn import Base -> from DBConn import Base

3. playerDataSet.py 실행 - 크롤링하여 가져온 선수 데이터를 테이블에 넣는 작업

4. playerImage.py 실행 - 선수의 이미지를 크롤링하여 이미지를 저장하는 폴더를 구성하는 작업 (셀레니움 활용)

#로컬 서버 시작 전 models.py 의 3번 줄 재수정
from DBConn import Base -> from database.DBConn import Base

5. backend 폴더 진입 후 uvicorn main:app --reload
        http://localhost:8000/docs 를 통하여 스웨거 확인

