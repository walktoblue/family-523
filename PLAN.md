# 우리 가족 찾기

기술 이름(slug): `family-523`

## 한 줄 소개
촌수를 모르는 자녀들이 가족 이름을 입력하면 관계와 프로필을 바로 확인할 수 있는 교육용 가족 관계 앱

## 핵심 흐름
1. 내 이름과 상대방 이름을 입력한다
2. 몇 촌인지, 어떤 관계인지, 연결 경로가 나온다
3. 상대방의 사진·나이·직업·관심사를 보며 더 가깝게 알게 된다

## 참고 앱/사이트
없음 — 따뜻하고 교육적인 느낌, 어린이·청소년도 쉽게 쓸 수 있게

## 설정
- 로그인: 관리자만 (가족 정보 추가·수정 시)
- LLM API: 불필요
- 외부 연동: 없음
- 민감정보: 없음

## 디자인
- 강조색: `#C17F3A` (따뜻한 황금빛 — 나무·가족 느낌)
- 배경: `#FDF8F0` · 글자: `#2D1F0F` · 카드: `#FFFFFF` · 테두리: `#E5D5B8`
- 상태색: 성공 `#4A7C59` · 오류 `#DC2626`
- 서브 강조색: `#4A7C59` (초록 — 자연·연결)
- 폰트: Noto Sans KR (본문) · Noto Serif KR (제목)
- 모서리(radius): 16px · 그림자: 옅게 카드에만 · 간격: 넉넉하게
- 레이아웃 원칙: 모바일 중심 1단, 최대 640px, 아이콘·뱃지·태그 활용

## 화면
1. **홈 — 관계 검색** — `/`
   - 보임: 1순위(이름 두 개 입력 + 검색 버튼) → 결과(촌수 뱃지·관계명·경로) → 전체 가족 목록
   - 동작: 내 이름·상대 이름 입력(자동완성) → 검색 → 결과 확인 → 상대방 프로필로 이동
   - 데이터: 읽음: family_members
   - 상태: 로딩 스피너 / 이름 없음 안내 / 관계 못 찾음 안내 / 결과 표시
   - 디자인: design/stitch_family_finder/_1/code.html

2. **멤버 프로필** — `/member/[id]`
   - 보임: 1순위(사진·이름·역할) → 나이·직업·관심사 태그 → 소개글 → 가족 연결(부모·배우자·자녀)
   - 동작: 가족 연결 탭 누르면 그 사람 프로필로 이동 / 관계 확인 버튼으로 홈으로
   - 데이터: 읽음: family_members (해당 멤버 + 연결된 멤버들)
   - 상태: 로딩 / 존재하지 않는 ID 안내
   - 디자인: design/stitch_family_finder/_3/code.html

3. **관리자 — 멤버 관리** — `/admin`
   - 보임: 1순위(멤버 목록) → 추가 버튼 → 수정/삭제 버튼
   - 동작: 멤버 클릭 → 수정 폼 → 저장 / + 버튼 → 새 멤버 추가 / 삭제 버튼 → 확인 후 삭제
   - 데이터: 읽음+씀: family_members
   - 상태: 저장 중 / 저장 완료 / 오류 메시지
   - 디자인: design/stitch_family_finder/_2/code.html

## 데이터 (Supabase 테이블)
- **family_members**
  - `id` text — 기본 키 (영문 slug, 예: roy, shingyun)
  - `name` text — 표시 이름 (한글)
  - `gender` text — male / female
  - `side` text — paternal(친가) / maternal(외가) / both / paternal_in / maternal_in
  - `role` text — 역할 설명 (예: 첫째딸, 사촌)
  - `birth_year` int — 출생연도
  - `occupation` text — 직업
  - `interests` text — 관심사 (쉼표 구분)
  - `description` text — 소개글
  - `photo_url` text — 사진 URL
  - `parent_ids` text[] — 부모 ID 배열
  - `spouse_id` text — 배우자 ID
  - 관계: parent_ids → family_members.id (자기 참조)

## 기술 스택
Next.js (App Router, TypeScript) · Tailwind CSS v4 · Supabase · Vercel

## MVP 범위
- 포함: 관계 검색, 촌수 계산, 멤버 프로필, 관리자 CRUD
- 제외 — 다음에: 가족 트리 시각화, 사진 업로드(스토리지), 로그인 인증

## 진행 상황
- [x] 기획 완료
- [ ] Stitch 프로토타입
- [ ] 연결 (GitHub · Vercel · Supabase)
- [ ] 구현: 홈 — 관계 검색
- [ ] 구현: 멤버 프로필
- [ ] 구현: 관리자 — 멤버 관리
- [ ] 배포 확인
