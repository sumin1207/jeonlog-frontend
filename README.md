🎨 전:록 (Exhibition Log)

**개인 맞춤형 전시 추천 & 전시 기록 공유 플랫폼**
React Native와 Spring 기반의 모바일 앱으로, 전시를 쉽고 재미있게 발견하고 기록하며 다른 사람과 공유할 수 있습니다.

---

## 🏆 프로젝트 개요

전:록은 사용자의 **연령, 성별, 취향 데이터**를 기반으로 한 전시 추천 시스템과
실제 전시 관람 경험을 **사진 + 글 기록**으로 공유할 수 있는 플랫폼입니다.

* 홈 화면: 개인 맞춤 추천, 인기 전시, 연령·성별별 추천
* 카테고리별 전시 탐색: 장르, 분위기, 지역
* 전시 기록: 사용자들이 남긴 사진·글 리뷰
* 마이페이지: 내가 찜한 전시, 내가 쓴 전시 기록
* 검색: 전시·미술관·박물관 키워드 검색, 실시간 검색어 TOP 10, 최근 검색어

---

## 🎯 주요 기능

### 🏠 홈 화면

* **개인 맞춤형 전시 추천**
* **연령·성별 기반 인기 전시**
* **현재 인기 전시 TOP 리스트**

### 📂 카테고리

* **장르별** (예: 현대미술, 사진, 설치미술 등)
* **분위기별** (예: 로맨틱, 감각적, 몰입형 등)
* **지역별** (예: 서울, 부산, 해외 등)

### 📝 전시 기록

* 다른 사용자들이 남긴 **사진 + 글** 기록 열람
* 기록 좋아요 및 댓글 기능

### 🙋 마이페이지

* 내가 찜한 전시 리스트
* 내가 작성한 전시 기록 관리

### 🔍 검색

* 전시, 미술관, 박물관 **키워드 검색**
* **실시간 검색어 TOP 10**
* **최근 검색어** 확인 및 삭제

---

## 🛠 기술 스택

### **Frontend (App)**

* **Framework**: React Native 0.xx
* **Language**: JavaScript / TypeScript
* **Navigation**: React Navigation
* **State Management**: Zustand / Redux
* **UI**: Styled-Components / Tailwind-RN
* **Image Handling**: React Native FastImage
* **Charts**: Victory Native / Recharts (RN 지원 버전)

### **Backend**

* **Framework**: Spring Boot 3.x
* **Language**: Java 17+
* **Database**: MySQL / PostgreSQL
* **API**: REST API
* **Auth**: JWT 기반 인증
* **추천 알고리즘**: 사용자 프로필 기반 전시 추천 로직

---

## 📂 프로젝트 구조

```
exhibition-log-app/
├── app/                    # React Native 앱 코드
│   ├── screens/            # 화면 컴포넌트
│   │   ├── Home/           # 홈 화면
│   │   ├── Category/       # 카테고리별 전시
│   │   ├── Record/         # 전시 기록
│   │   ├── MyPage/         # 마이페이지
│   │   └── Search/         # 검색 화면
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── store/              # Zustand/Redux 상태 관리
│   ├── utils/              # 유틸 함수
│   ├── assets/             # 이미지, 폰트
│   └── styles/             # 전역 스타일
├── backend/                # Spring Boot 서버 코드
│   ├── controller/         # REST API 컨트롤러
│   ├── service/            # 비즈니스 로직
│   ├── repository/         # DB 접근
│   ├── model/              # 엔티티 클래스
│   └── config/             # 설정 파일
└── README.md
```

---

## 🚀 시작하기

### 1. 프론트엔드 실행

```bash
# 의존성 설치
npm install

# 앱 실행 (Expo 사용 시)
npx expo start
```

### 2. 백엔드 실행

```bash
# Maven 빌드
./mvnw clean install

# 서버 실행
./mvnw spring-boot:run
```

---

## 🎨 주요 UI/UX 특징

* **개인 맞춤형 추천 로직**: 사용자 프로필 기반
* **간결하고 직관적인 화면 구성**
* **카드형 전시 정보 디자인**
* **검색어 자동완성 & 인기 검색어 노출**
* **사진 중심의 전시 기록 피드**

---

## 🤝 기여 방법

1. 프로젝트 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경 사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

---

## 📝 라이선스

이 프로젝트는 **MIT License**로 배포됩니다.

