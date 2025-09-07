import axios from "axios";

const searchService = axios.create({
  baseURL:
    "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/api/exhibitions",
  timeout: 3000,
});

export const searchExhibitions = async (query: string) => {
  const response = await searchService.get(`/search?query=${query}`);
  console.log(response.data);
  return response.data;
};

export default searchService;
