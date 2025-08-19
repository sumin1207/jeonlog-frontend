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
    return [
      200,
      {
        result: [
          { id: 1, title: `${query} 결과 1` },
          { id: 2, title: `${query} 결과 2` },
        ],
      },
    ];
  });
}

export default searchService;
