import axios from "axios";

const searchService = axios.create({
  baseURL: "https://localhost:8081/api",
  timeout: 3000,
});

// Expo 앱(네이티브) 환경에서만 모킹 활성화
if (__DEV__ && !(typeof window !== "undefined" && window.document)) {
  // window.document가 없으면 앱(네이티브) 환경
  const MockAdapter = require("axios-mock-adapter");
  const mock = new MockAdapter(searchService, { delayResponse: 500 });
  mock.onGet("/search").reply((config: any) => {
    const query = config.params?.query;
    if (!query) {
      return [400, { error: "query 누락 등 잘못된 요청" }];
    }
    if (query === "error") {
      return [500, { error: "서버 오류" }];
    }

    // 검색어에 따른 다양한 결과 반환
    const mockResults = [
      {
        id: 1,
        title: `${query} 관련 전시회`,
        description: `${query}에 대한 특별 전시회가 진행 중입니다.`,
        location: "국립중앙박물관",
        date: "2025.01.01 - 2025.12.31",
        category: "전시",
      },
      {
        id: 2,
        title: `${query} 아티스트 특별전`,
        description: `${query}의 작품들을 한자리에서 만나보세요.`,
        location: "DDP 뮤지엄",
        date: "2025.02.01 - 2025.05.31",
        category: "전시",
      },
      {
        id: 3,
        title: `${query} 시대의 예술`,
        description: `${query} 시대의 예술 작품들을 소개합니다.`,
        location: "MMCA",
        date: "2025.03.01 - 2025.06.30",
        category: "전시",
      },
    ];

    return [
      200,
      {
        result: mockResults,
      },
    ];
  });

  // 전시회 검색 API 모킹
  mock.onGet("/exhibitions/search").reply((config: any) => {
    const query = config.params?.query;
    if (!query) {
      return [400, { error: "query 누락 등 잘못된 요청" }];
    }
    if (query === "error") {
      return [500, { error: "서버 오류" }];
    }

    // 전시회 검색 결과 모킹
    const mockExhibitionResults = [
      {
        id: "exh_1",
        title: `${query} 특별전`,
        description: `${query}에 대한 깊이 있는 전시회입니다.`,
        location: "국립중앙박물관",
        address: "서울특별시 용산구 서빙고로 137",
        startDate: "2025-01-15",
        endDate: "2025-04-15",
        category: "전시",
        image: "https://example.com/exhibition1.jpg",
        price: "성인 5,000원",
        operatingHours: "09:00 - 18:00",
        phone: "02-2077-9000",
        website: "www.museum.go.kr",
        isBookmarked: false,
        isLiked: false,
        likeCount: 42,
      },
      {
        id: "exh_2",
        title: `${query} 아티스트 회고전`,
        description: `${query}의 대표작들을 한자리에서 만나보세요.`,
        location: "DDP 뮤지엄",
        address: "서울 중구 을지로 281",
        startDate: "2025-02-01",
        endDate: "2025-05-31",
        category: "전시",
        image: "https://example.com/exhibition2.jpg",
        price: "성인 8,000원",
        operatingHours: "10:00 - 19:00",
        phone: "02-325-1077",
        website: "www.ddpmuseum.com",
        isBookmarked: true,
        isLiked: true,
        likeCount: 128,
      },
      {
        id: "exh_3",
        title: `${query} 현대미술전`,
        description: `${query}를 주제로 한 현대미술 작품들을 소개합니다.`,
        location: "국립현대미술관",
        address: "서울특별시 종로구 삼청로 30",
        startDate: "2025-03-01",
        endDate: "2025-06-30",
        category: "전시",
        image: "https://example.com/exhibition3.jpg",
        price: "성인 4,000원",
        operatingHours: "10:00 - 18:00",
        phone: "02-3456-7890",
        website: "www.mmca.go.kr",
        isBookmarked: false,
        isLiked: false,
        likeCount: 67,
      },
    ];

    return [
      200,
      {
        success: true,
        data: mockExhibitionResults,
        total: mockExhibitionResults.length,
        message: "검색이 완료되었습니다.",
      },
    ];
  });
}

export default searchService;
