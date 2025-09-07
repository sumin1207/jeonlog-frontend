import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "@/components/ui/TopBar";
import { NaverMap } from "@/components/ui";
import { useTheme } from "@/contexts/ThemeContext";
import { exhibitionData } from "@/data/exhibitionsDataStorage";
import { organizeExhibitionsByDate } from "@/data/organizeByDate";

const { width: screenWidth } = Dimensions.get("window");

const ExhibitionList = ({
  title,
  exhibitions,
  router,
  theme,
}: {
  title: string;
  exhibitions: any[];
  router: any;
  theme: string;
}) => {
  if (!exhibitions || exhibitions.length === 0) {
    return null;
  }

  const styles = StyleSheet.create({
    section: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      margin: 15,
      marginBottom: 20,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 20,
      letterSpacing: 0.5,
    },
    exhibitionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333" : "#eee",
    },
    exhibitionImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 15,
    },
    exhibitionInfo: {
      flex: 1,
    },
    exhibitionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 4,
    },
    exhibitionDate: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title} ({exhibitions.length}개)
      </Text>
      {exhibitions.map((exhibition, index) => (
        <TouchableOpacity
          key={exhibition.id}
          style={[
            styles.exhibitionItem,
            index === exhibitions.length - 1 && { borderBottomWidth: 0 },
          ]}
          onPress={() => router.push(`/exhibition/${exhibition.id}` as any)}
          activeOpacity={0.7}>
          <Image
            source={exhibition.image}
            style={styles.exhibitionImage}
            resizeMode='cover'
          />
          <View style={styles.exhibitionInfo}>
            <Text style={styles.exhibitionTitle}>{exhibition.title}</Text>
            <Text style={styles.exhibitionDate}>{exhibition.date}</Text>
          </View>
          <Ionicons
            name='chevron-forward'
            size={20}
            color={theme === "dark" ? "#ccc" : "#666"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function MuseumDetailScreen() {
  const { name: rawName } = useLocalSearchParams<{ name: string }>();
  const name = decodeURIComponent(rawName || "");
  const router = useRouter();
  const { theme } = useTheme();

  // 박물관/미술관 데이터 (나중에 props나 context로 전달받을 수 있음)
  const museumData = {
    국립중앙박물관: {
      //완료
      name: "국립중앙박물관",
      headerImage: require("../../../assets/images/museumBackground/bg1.jpg"),
      museumEmblem: require("../../../assets/images/museumEmblem/logo1.png"),
      address: "04383 서울시 용산구 서빙고로 137(용산동6가 168-6)",
      latitude: 37.524058,
      longitude: 126.980455,
      phone: "02)2077-9000",
      website: "www.museum.go.kr",
      hours:
        "월, 화, 목, 금, 일요일: 10:00 - 18:00 (입장 마감: 17:30)\n수, 토요일: 10:00 - 21:00 (입장 마감: 20:30)\n옥외 전시장(정원): 7:00 - 22:00",
      closedDays:
        "휴관일: 1월1일, 설날(1.29.), 추석(10.6.)\n상설전시관 정기휴실일: 매년 4월, 11월(첫째 월요일)\n상설전시관 내 특별전시실 2 휴실\n특별전시실 1(특별전시 미운영시 휴실),\n야외전시장은 정상 개관\n2025년 휴실일: 4.7.(월), 11.3.(월)",
      entrance:
        "무료(상설전시관, 어린이박물관, 무료 특별전시 해당) /\n유료(유료 특별전시 해당)\n\n관람권 구입하는 곳: 특별전시실 1 앞 매표소\n관람권 판매시간: 관람 종료 30분 전까지",
      description:
        "관람시 주의하는 곳: 특별전시실 내 영상촬영 금지\n관람시 편의시설: 관람 촬영 30분 전까지",
      parking: "400번, 502번",
      parkingFee:
        "승용차(15인승 이하)기준 기본요금 2000원, 매 30분당 500원(1일최대 10,000원)",
      exhibitions: [{}],
      subway:
        "4호선\n경의중앙선(문산-용문)\n이촌역 2번 출구 방향 '박물관 나들길' <=> '박물관 서문'\n이촌역 2번출구 <=> 박물관 서문",
    },
    마이아트뮤지엄: {
      //배경 사진 아쉽
      name: "마이아트뮤지엄",
      headerImage: require("../../../assets/images/museumBackground/myArtMuseumBg.jpg"), //수정
      museumEmblem: require("../../../assets/images/museumEmblem/myArtMuseumEmblem.png"),
      address: "서울특별시 강남구 테헤란로 518 섬유센터빌딩 B1 (대치동 994-31)",
      latitude: 37.507017,
      longitude: 127.063147,
      phone: "02-567-8878",
      website: "http://www.myartmuseum.co.kr",
      hours: "월~일 10:00 - 19:40 (입장 마감 19:00)",
      closedDays: "설날, 추석 당일 휴관 / 그 외 공휴일 정상 운영",
      entrance:
        "성인 22,000원, 청소년 18,000원, 어린이 14,000원\n(전시에 따라 다름, 증빙 시 4세 미만 무료) / 단체(20인 이상) 별도 할인",
      description:
        "서울 강남구 삼성역 4번 출구 도보 3분, 도심 속 대형 복합 미술관 겸 복합문화공간. 다양한 서양 명화·아트·디자인·장식·사진전으로 계절마다 새로운 콘텐츠와 편의시설을 즐길 수 있음.",
      parking: "건물 내 지하주차장(유료), 인근 공영주차장 이용 가능",
      parkingFee:
        "분당 2,000~3,000원 (운영 정책에 따라 변동, 건물 주차장 기준)",
      subway: "2호선 삼성역 4번 출구 도보 3분",
      exhibitions: [
        {
          id: "11",
          title:
            "이탈리아 국립 카포디몬테 미술관 19세기 컬렉션: 나폴리를 거닐다",
          date: "2025.08.01 - 2025.11.30",
          image: require("../../../assets/images/exhibitionPoster/exhibition11.jpg"),
        },
      ],
    },
    ddp: {
      name: "DDP 뮤지엄",
      headerImage: require("../../../assets/images/museumBackground/ddpBg.jpg"),
      museumEmblem: require("../../../assets/images/museumEmblem/ddpEmblem.jpg"),
      address: "서울 중구 을지로 281",
      latitude: 37.566535,
      longitude: 127.009422,
      phone: "02-325-1077",
      website: "www.ddpmuseum.com",
      hours: "매일 10:00-19:00 (월요일 휴관)",
      entrance: "일반 15,000원, 학생 12,000원",
      closedDays: undefined,
      description:
        "동대문디자인플라자 내에 위치한 현대적인 뮤지엄으로, 디자인과 예술의 경계를 넘나드는 혁신적인 전시를 선보입니다.",
      parking: undefined,
      parkingFee: undefined,
      subway: undefined,
      exhibitions: [{}],
    },

    모다갤러리: {
      name: "모다갤러리",
      headerImage: undefined, //배경사진 뭐하지
      museumEmblem: require("../../../assets/images/museumEmblem/modaEmblem.png"),
      address: "서울특별시 용산구 녹사평대로 132 3, 4층 (이태원동)",
      latitude: 37.534013,
      longitude: 126.994605,
      phone: "0507-1484-2511안내",
      website: undefined,
      hours: "화요일~일요일 10:30 - 19:00 (입장 마감 18:30), 월요일 휴관",
      closedDays: "매주 월요일 휴관 및 4월 26일(2025년 기준)",
      entrance:
        "성인 15,000원 / 소인 11,000원 / 국가유공자·경로우대·장애인 7,500원",
      description:
        "모다갤러리는 서울 이태원 지역에 위치한 현대미술 갤러리로, 국내외 거장들의 다양한 현대미술 작품을 선보입니다. 예술적 교류의 장이자 문화 체험 공간입니다.",
      parking: "전용 주차장 없음, 대중교통 이용 권장",
      parkingFee: undefined,
      subway: "6호선 이태원역 인근",
      exhibitions: [{}],
    },
    뮤지엄209: {
      name: "뮤지엄209",
      headerImage: undefined, //배경사진 뭐하지
      museumEmblem: require("../../../assets/images/museumEmblem/museum209Emblem.jpg"),
      address: "서울특별시 송파구 잠실로 209 소피텔 앰배서더 서울 호텔 3층",
      latitude: 37.514219,
      longitude: 127.103073,
      phone: "02-6953-8016",
      website: "https://www.instagram.com/museum209/",
      hours: "10:00~19:00 (입장 마감 18:00)",
      closedDays: "매주 월요일",
      entrance: "전시별로 상이함 (성인 15,000원, 청소년/어린이 12,000원 기준)",
      description:
        "근현대 경계를 넘나드는 범주의 아티스트와 문화, 예술을 아카이브하고 다양한 관람객에게 소개하는 새로운 미술관. 기존 미술관의 프레임을 벗어나 다양한 컨텐츠를 소개하며 관람객과 함께 문화와 예술로 공감하는 열린 미술관",
      parking: "소피텔 앰배서더 서울 호텔 주차장 이용",
      parkingFee: "호텔 주차료 정책에 따름",
      subway: "2호선 잠실나루역, 8호선 몽촌토성역",
      exhibitions: [{}],
    },
    뮤지엄한미: {
      name: "뮤지엄한미",
      headerImage: undefined, //require("../../../assets/images/museumBackground/museumHanmiBackground.jpg"), //출처 이슈
      museumEmblem: require("../../../assets/images/museumEmblem/museumHanmiEmblem.png"),
      address:
        "서울특별시 종로구 삼청로 9길 45 (본관), 서울특별시 종로구 삼청로 11길 11 (별관)",
      latitude: 37.585219,
      longitude: 126.983767,
      phone: "02-733-1315",
      website: "https://museumhanmi.or.kr/",
      hours: "화-일요일 10:00 - 18:00",
      closedDays: "매주 월요일",
      entrance:
        "성인 15,000원, 학생 7,500원, 경로 7,500원, 종로구민·재직자·재학생 7,500원 (본관, 별관 통합권)",
      description:
        "국내 최초의 사진전문 미술관으로, 사진예술의 확장으로의 변화를 추구하는 복합문화플랫폼. 20,000장 이상의 사진 프린트와 필름 롤을 보관하는 수장고를 운영",
      parking: "주차공간 협소, 대중교통 이용 권장",
      parkingFee: "주차장 없음",
      subway:
        "시청역 4번 출구 혹은 광화문역 2번 출구 - 종로 11번 마을버스 환승 - 삼청공원 정류소 하차",
      exhibitions: [{}],
    },
    환기미술관: {
      name: "환기미술관",
      headerImage: undefined, //require("../../../assets/images/museumBackground/whankiBg.jpg"),
      museumEmblem: require("../../../assets/images/museumEmblem/whankiEmblem.jpg"),
      address: "서울시 종로구 자하문로40길 63",
      latitude: 37.59431,
      longitude: 126.96892,
      phone: "02-391-7701",
      website: "https://whankimuseum.org",
      hours: "오전 10시~오후 6시 (입장마감 오후 5시)",
      closedDays: "매주 월요일 휴관",
      entrance: "전시 종류에 따라 상이 (웹사이트 확인 필요)",
      description:
        "한국 현대미술의 선구자 김환기 화백의 작품을 전시하는 미술관. 북악산 자락에 위치하며 김환기 화백의 작품 2,000여 점을 포함하여 총 2,500여 점의 작품을 보유. 본관, 별관, 수향산방의 3건물로 구성",
      parking: "소규모 주차장 운영",
      parkingFee: "주차료 별도",
      subway: "3호선 경복궁역, 부암동 방향 버스 이용",
      exhibitions: [{}],
    },
    세화미술관: {
      name: "세화미술관",
      headerImage: require("../../../assets/images/museumBackground/sehwaBg.jpg"),
      museumEmblem: require("../../../assets/images/museumEmblem/sehwaEmblem.png"),
      address: "서울시 종로구 새문안로 68 흥국생명빌딩 2층",
      latitude: 37.570863,
      longitude: 126.975963,
      phone: "02-2002-7789",
      website: "https://sehwamuseum.org",
      hours: "화-일요일 10:00-18:00 (입장 마감 시간 17:30)",
      closedDays: "매주 월요일, 매년 1월 1일, 추석 당일, 성탄절",
      entrance: "전시에 따라 상이",
      description:
        "현대미술과 다양한 장르의 실험적 기획전을 선보이는 미술관. 광화문 인근에 위치하여 접근성이 좋으며, 젊은 작가들의 작품을 중심으로 기획전시를 진행",
      parking:
        "흥국생명빌딩 지하주차장 이용 (전시 관람객에 한해 2시간 무료주차)",
      parkingFee: "2시간 무료, 이후 유료",
      subway: "5호선 광화문역 6번 출구로 나와 약 250m 직진",
      exhibitions: [{}],
    },
    한원미술관: {
      name: "한원미술관",
      headerImage: require("../../../assets/images/museumBackground/hanwonBg.jpg"),
      museumEmblem: require("../../../assets/images/museumEmblem/hanwonEmblem.png"),
      address: "서울특별시 서초구 서초동 1449-12",
      latitude: 37.480649,
      longitude: 127.012856,
      phone: "02-588-5853",
      website: "http://www.hanwon.org",
      hours: "화-일 10:00-18:00",
      closedDays: "매주 월요일",
      entrance: "무료",
      description:
        "한국 구상미술의 발전과 일반 공중의 문화교육에 이바지할 목적으로 1993년 설립된 사립미술관. 예술의전당 맞은편에 위치하며 젊은 작가들의 실험적 작품을 소개",
      parking: "소규모 주차장 운영",
      parkingFee: "무료",
      subway: "3호선 남부터미널역, 2호선 서초역에서 도보",
      exhibitions: [{}],
    },
    송은: {
      name: "송은",
      headerImage: require("../../../assets/images/museumBackground/songeunBg.jpg"), //배경사진 다시 구해야함
      museumEmblem: require("../../../assets/images/museumEmblem/songeunEmblem.jpg"),
      address: "06016 서울 강남구 도산대로 441 (청담동)",
      latitude: 37.520087,
      longitude: 127.049622,
      phone: "02-3448-0100",
      website: "https://www.songeunartspace.org",
      hours: "11:00~18:30",
      closedDays: "일요일, 공휴일",
      entrance: "무료 (네이버 사전예약 필수)",
      description:
        "미술계 젊은 인재들의 전시와 연구 활동을 지원하는 비영리 문화재단. 헤르조그&드 뫼롱이 설계한 삼각형 모양의 건물이 특징적이며, 송은미술대상전 등 신진 작가 지원사업을 지속적으로 운영",
      parking: "교통약자 외 주차장 이용 불가",
      parkingFee: "주차 불가",
      subway: "수인분당선 압구정로데오역 4번 출구, 도보 10분",
      exhibitions: [{}],
    },
    푸투라서울: {
      name: "푸투라서울",
      headerImage: require("../../../assets/images/museumBackground/futuraBg.png"), //배경사진 조정필요
      museumEmblem: require("../../../assets/images/museumEmblem/futuraEmblem.png"),
      address: "서울 종로구 북촌로 61",
      latitude: 37.582455,
      longitude: 126.985022,
      phone: "02-000-0000",
      website: "https://futuraseoul.org",
      hours: "10:30 ~ 19:00, 목금 21:00까지",
      closedDays: "매주 월요일 휴관",
      entrance: "전시에 따라 상이",
      description:
        "북촌 한옥마을에 위치한 예술공간. WGNB가 설계한 1층 로비와 후원, 2층 전시실과 중정, 3층 테라스와 옥상으로 구성. 10.8m 높이의 대형 전시실 '백 개의 시'를 중심으로 미래지향적 전시를 선보임",
      parking: "주차장 없음, 대중교통 이용",
      parkingFee: "주차장 없음",
      subway: "3호선 안국역에서 도보 15분",
      exhibitions: [{}],
    },
    아르코미술관: {
      name: "아르코미술관",
      headerImage: require("../../../assets/images/museumBackground/arkoBg.jpg"), //배경사진 애매
      museumEmblem: require("../../../assets/images/museumEmblem/arkoEmblem.jpg"),
      address: "03087 서울 종로구 동숭길 3 (동숭동, 한국문화예술진흥원)",
      latitude: 37.582076,
      longitude: 127.002045,
      phone: "02-760-4850",
      website: "https://www.arko.or.kr/artcenter/",
      hours: "11:00 ~ 19:00 (입장마감 18:30)",
      closedDays: "월요일, 1월 1일, 설날·추석 당일",
      entrance: "무료",
      description:
        "한국문화예술진흥원 산하 미술회관으로 개관된 미술관. 다양한 장르의 실험적인 기획전과 대중과 소통할 수 있는 교육프로그램, 국제교류 네트워크를 활용한 협업 프로그램 운영",
      parking: "대중교통 이용 권장",
      parkingFee: "별도 문의",
      subway: "4호선 혜화역 2번 출구, 도보 2분",
      exhibitions: [{}],
    },
    예술의전당: {
      name: "예술의 전당",
      headerImage: require("../../../assets/images/museumBackground/sacBg.jpg"), //배경사진 애매
      museumEmblem: require("../../../assets/images/museumEmblem/sacEmblem.png"),
      address: "서울특별시 서초구 남부순환로 2406 예술의전당",
      latitude: 37.479966,
      longitude: 127.0133,
      phone: "02-580-1300",
      website: "http://www.sac.or.kr/",
      hours: "시설별 상이 (공연 및 전시 일정에 따라 변동)",
      closedDays: "공연일정에 따라 변경",
      entrance: "시설 및 공연/전시에 따라 상이",
      description:
        "대한민국 대표 종합 예술기관으로 오페라하우스, 콘서트홀, 한가람미술관, 한가람디자인미술관 등 다양한 시설을 보유. 클래식, 오페라, 연극, 뮤지컬, 전시 등 다양한 장르의 공연과 전시를 선보임",
      parking: "대형 주차장 운영",
      parkingFee: "유료 (시간당 요금제)",
      subway: "3호선 남부터미널역 5번 출구에서 셔틀버스 이용 또는 도보 15분",
      exhibitions: [{}],
    },
  };

  const museum = museumData[name as keyof typeof museumData];

  const allMuseumExhibitions = Object.values(exhibitionData).filter(
    (exhibition) => museum && exhibition.museumName === museum.name
  );

  const { ongoing, upcoming, past } =
    organizeExhibitionsByDate(allMuseumExhibitions);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    content: {
      flex: 1,
    },
    headerNavBar: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: 65,
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingVertical: 15,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
    },
    imageSection: {
      height: 200,
    },
    museumImage: {
      width: "100%",
      height: "100%",
    },
    museumInfoHeader: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
    },
    museumTitleSection: {
      flex: 1,
    },
    titleContainer: {
      width: "100%",
    },
    firstRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    secondRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    museumEmblem: {
      width: 100,
      height: 1,
      marginLeft: 12,
    },
    backButton: {
      padding: 5,
    },
    navTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#000",
      flex: 1,
      textAlign: "center",
      marginHorizontal: 20,
    },
    rightIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {
      padding: 5,
      marginLeft: 10,
    },
    museumNameLarge: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#000",
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      margin: 0,
      padding: 0,
    },
    museumEmblemIcon: {
      width: 81,
      height: 60,
      marginLeft: 12,
    },
    leftSection: {
      flex: 1,
    },
    centerSection: {
      alignItems: "center",
    },
    rightIconsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    govText: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      fontWeight: "500",
    },
    govSubtext: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
    },
    locationText: {
      fontSize: 12,
      color: theme === "dark" ? "#999" : "#999",
    },
    headerSection: {
      padding: 25,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      margin: 15,
      marginBottom: 20,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    museumName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 10,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
      paddingVertical: 4,
    },
    infoText: {
      fontSize: 15,
      color: theme === "dark" ? "#ccc" : "#555",
      marginLeft: 12,
      flex: 1,
      lineHeight: 22,
      letterSpacing: 0.3,
    },
    infoLabel: {
      fontSize: 16,
      color: theme === "dark" ? "#fff" : "#1c3519",
      fontWeight: "700",
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    description: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      lineHeight: 20,
      marginTop: 10,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
    },
    errorBackButton: {
      backgroundColor: "#4CAF50",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    backButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    locationInfo: {
      marginBottom: 15,
    },
    mapContainer: {
      alignItems: "center",
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    infoSection: {
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    section: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      margin: 15,
      marginBottom: 20,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 20,
      letterSpacing: 0.5,
    },
  });

  if (!museum) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.errorText,
              { color: theme === "dark" ? "#fff" : "#333" },
            ]}>
            박물관 정보를 찾을 수 없습니다.
          </Text>
          <TouchableOpacity
            style={styles.errorBackButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />

      {/* 헤더 네비게이션 바 */}
      <View style={styles.headerNavBar}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons
            name='chevron-back'
            size={24}
            color={theme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        {/* 박물관 이름 */}
        <Text style={styles.navTitle}>{museum.name}</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 박물관 이미지 */}
        <View style={styles.imageSection}>
          <Image
            source={museum.headerImage}
            style={styles.museumImage}
            resizeMode='cover'
          />
        </View>

        {/* 박물관 정보 헤더 */}
        <View style={styles.museumInfoHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.firstRow}>
              <Text style={styles.museumNameLarge}>{museum.name}</Text>
              {museum.museumEmblem && (
                <Image
                  source={museum.museumEmblem}
                  style={styles.museumEmblemIcon}
                  resizeMode='contain'
                />
              )}
            </View>
            <View style={styles.secondRow}>
              <Text style={styles.locationText}>전시장소</Text>
              <View style={styles.rightIconsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  activeOpacity={0.7}>
                  <Ionicons
                    name='heart-outline'
                    size={24}
                    color={theme === "dark" ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  activeOpacity={0.7}>
                  <Ionicons
                    name='share-outline'
                    size={24}
                    color={theme === "dark" ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 박물관 기본 정보 */}
        <View style={styles.headerSection}>
          {/* 2. 관람시간 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>관람시간</Text>
            <Text style={styles.infoText}>{museum.hours}</Text>
          </View>

          {/* 3. 휴관일 및 휴실일 */}
          {museum.closedDays && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>휴관일 및 휴실일</Text>
              <Text style={styles.infoText}>{museum.closedDays}</Text>
            </View>
          )}

          {/* 4. 관람료 */}
          {museum.entrance && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>관람료</Text>
              <Text style={styles.infoText}>{museum.entrance}</Text>
            </View>
          )}

          {/* 5. 위치 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>위치</Text>
            <Text style={styles.infoText}>{museum.address}</Text>
          </View>

          {/* 6. 전화 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>전화</Text>
            <Text style={styles.infoText}>{museum.phone}</Text>
          </View>

          {/* 7. 지하철 */}
          {museum.subway && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>지하철</Text>
              <Text style={styles.infoText}>{museum.subway}</Text>
            </View>
          )}

          {/* 8. 버스 */}
          {museum.parking && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>버스</Text>
              <Text style={styles.infoText}>{museum.parking}</Text>
            </View>
          )}

          {/* 9. 주차요금 */}
          {museum.parkingFee && (
            <View
              style={[
                styles.infoSection,
                { borderBottomWidth: 0, paddingBottom: 0 },
              ]}>
              <Text style={styles.infoLabel}>주차요금</Text>
              <Text style={styles.infoText}>{museum.parkingFee}</Text>
            </View>
          )}
        </View>

        {/* 위치 정보 및 지도 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>위치 정보</Text>

          {/* 주소 정보 */}
          <View style={styles.locationInfo}>
            <View style={styles.infoRow}>
              <Ionicons
                name='location-outline'
                size={16}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <Text style={styles.infoText}>{museum.address}</Text>
            </View>
          </View>

          {/* 네이버맵 */}
          <View style={styles.mapContainer}>
            <NaverMap
              latitude={museum.latitude}
              longitude={museum.longitude}
              title={museum.name}
              address={museum.address}
              height={250}
            />
          </View>
        </View>

        <ExhibitionList
          title='현재 전시'
          exhibitions={ongoing}
          router={router}
          theme={theme}
        />
        <ExhibitionList
          title='예정된 전시'
          exhibitions={upcoming}
          router={router}
          theme={theme}
        />
        <ExhibitionList
          title='지난 전시'
          exhibitions={past}
          router={router}
          theme={theme}
        />
      </ScrollView>
    </View>
  );
}
