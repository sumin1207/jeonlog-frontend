import { exhibitionData } from "./exhibitionsDataStorage";
//지난 전시, 진행 중 전시, 예정된 전시 구분
export interface Exhibition {
  id: string;
  title: string;
  location: string;
  address: string;
  date: string;
  time: string;
  price: string;
  category: string;
  description: string;
  explanation: string;
  exhibits?: string;
  image: any;
  sponsor: string;
  phone: string;
  website: string;
  subtitle?: string;
  explanationImages?: any[];
  curator?: string;
  email?: string;
}

interface OrganizedExhibitions {
  past: Exhibition[];
  ongoing: Exhibition[];
  upcoming: Exhibition[];
}

const organizeExhibitionsByDate = (): OrganizedExhibitions => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const organized: OrganizedExhibitions = {
    past: [],
    ongoing: [],
    upcoming: [],
  };

  for (const key in exhibitionData) {
    const exhibition = exhibitionData[key as keyof typeof exhibitionData];
    const dateRange = exhibition.date.split(" - ");

    const startDateStr = dateRange[0].trim();
    let endDateStr =
      dateRange.length > 1 ? dateRange[1].trim().split(" (")[0] : startDateStr;

    const startDateParts = startDateStr
      .split(".")
      .map((part) => parseInt(part, 10));
    let endDateParts = endDateStr.split(".").map((part) => parseInt(part, 10));

    const startYear = startDateParts[0];

    if (endDateParts.length < 3) {
      endDateParts.unshift(startYear);
    }

    const startDate = new Date(
      startDateParts[0],
      startDateParts[1] - 1,
      startDateParts[2]
    );
    const endDate = new Date(
      endDateParts[0],
      endDateParts[1] - 1,
      endDateParts[2]
    );

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (endDate < today) {
      organized.past.push(exhibition);
    } else if (startDate > today) {
      organized.upcoming.push(exhibition);
    } else {
      organized.ongoing.push(exhibition);
    }
  }

  return organized;
};

export const organizedExhibitions = organizeExhibitionsByDate();
