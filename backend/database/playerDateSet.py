import requests
from bs4 import BeautifulSoup
from backend.database.DBConn import get_db  
from backend.database.models import Player

# 세션 인스턴스 직접 사용
db = next(get_db())

try:
    db.query(Player).delete()

    for page in range(1, 21):
        url = f"https://www.transfermarkt.com/spieler-statistik/wertvollstespieler/marktwertetop/plus/ajax/yw1/adsafe_ip/page/8/page/5//page/{page}"

        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            player_rows = soup.select('table.items > tbody > tr')

            for player_row in player_rows:
                rank = int(player_row.select_one('td.zentriert').text.strip())
                player_name = player_row.select_one('td.hauptlink a[title]').text.strip()
                position = player_row.select_one('table.inline-table tr:nth-of-type(2) td').text.strip()
                age = int(player_row.select_one('td.zentriert:nth-of-type(3)').text.strip())
                nationality = player_row.select_one('td.zentriert:nth-of-type(4) img')['title']
                current_team = player_row.select_one('td.zentriert + td.zentriert + td a[title]')['title']
                market_value_str = player_row.select_one('td.rechts.hauptlink').text.strip()

                # "€"와 "m" 제거 후 숫자로 변환
                market_value = float(market_value_str.replace('€', '').replace('m', ''))

                # 데이터베이스에 데이터 삽입
                player = Player(rank=rank, player_name=player_name, position=position, age=age, nationality=nationality, current_team=current_team, market_value=market_value)
                db.add(player)

            db.commit()
            print(f"페이지 {page}의 데이터를 데이터베이스에 삽입했습니다.")

        else:
            print(f"페이지를 가져오지 못했습니다. 상태 코드: {response.status_code}")

except Exception as e:
    print(f"오류가 발생했습니다: {e}")

finally:
    # 세션 종료
    db.close()
