import time
import base64
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import requests
from PIL import Image
import io
from DBConn import get_db  
from models import Player

# 현재 스크립트 파일의 디렉터리를 가져옵니다.
script_dir = os.path.dirname(os.path.abspath(__file__))

# 이미지를 저장할 폴더 경로를 만듭니다.
image_folder_path = os.path.join(script_dir, "player_images")

# 만약 폴더가 없다면 생성합니다.
if not os.path.exists(image_folder_path):
    os.makedirs(image_folder_path)

# 세션 인스턴스 직접 사용
db = next(get_db())

# Selenium WebDriver를 초기화합니다.
driver = webdriver.Chrome()

try:
    players = db.query(Player).all()

    for player in players:
        player_name = player.player_name
        rank = player.rank

        # 크롤링할 웹페이지 URL (선수 이름으로 검색)
        player_name_encoded = '+'.join(player_name.split())  # 공백을 '+'로 대체
        search_url = f"https://www.google.com/search?q={player_name_encoded}&tbm=isch"  
        
        # 웹페이지를 엽니다.
        driver.get(search_url)

        # 이미지가 로드될 때까지 대기합니다. WebDriverWait로 변경
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '#islrg > div.islrc > div:nth-child(2) > a.FRuiCf.islib.nfEiy > div.fR600b.islir > img'))
        )

        # 이미지를 선택합니다.
        image = driver.find_element(By.CSS_SELECTOR, '#islrg > div.islrc > div:nth-child(2) > a.FRuiCf.islib.nfEiy > div.fR600b.islir > img')

        # 이미지 URL을 얻습니다.
        image_data_url = image.get_attribute('src')

        # 'data:' URL에서 base64 인코딩된 이미지 데이터를 디코딩합니다.
        _, image_data = image_data_url.split(';base64,')
        img = Image.open(io.BytesIO(base64.b64decode(image_data)))

        # 이미지 크기를 조절하고 흰색 배경 추가
        target_size = (300, 300)  # 원하는 크기로 조절 (가로 300, 세로 300)
        new_img = Image.new("RGB", target_size, "white")
        img.thumbnail(target_size)
        position = ((target_size[0] - img.width) // 2, (target_size[1] - img.height) // 2)
        new_img.paste(img, position)

        # 이미지를 저장할 파일 경로를 만듭니다. rank도 추가
        image_filename = f"{rank}_{player_name}.jpg"
        image_path = os.path.join(image_folder_path, image_filename)

        # 이미지 저장
        new_img.save(image_path, quality=85)

        print(f"{image_filename}을(를) 다운로드 및 저장했습니다.")

        # 다음 선수 처리 전에 잠시 대기
        time.sleep(1)  # 예시로 1초 대기 (필요에 따라 조절하세요)

except Exception as e:
    print(f"오류가 발생했습니다: {e}")

finally:
    # 세션 종료
    db.close()

    # Selenium WebDriver를 종료합니다.
    driver.quit()
