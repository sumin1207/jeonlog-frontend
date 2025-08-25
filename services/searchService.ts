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
}

export default searchService;
