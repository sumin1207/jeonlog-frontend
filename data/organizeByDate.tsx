export interface Exhibition {
  id: string;
  title: string;
  museumName?: string;
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

export const organizeExhibitionsByDate = (
  exhibitions: Exhibition[]
): OrganizedExhibitions => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const organized: OrganizedExhibitions = {
    past: [],
    ongoing: [],
    upcoming: [],
  };

  exhibitions.forEach((exhibition) => {
    const dateMatch = exhibition.date.match(
      /(\d{4}\.\d{1,2}\.\d{1,2})\s*-\s*(\d{4}\.\d{1,2}\.\d{1,2})/
    );
    if (dateMatch) {
      const startDate = new Date(dateMatch[1].replace(/\./g, "-"));
      const endDate = new Date(dateMatch[2].replace(/\./g, "-"));
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
  });

  return organized;
};