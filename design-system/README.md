# Jeonlog Design System

프로젝트의 일관된 디자인을 위한 통합 디자인 시스템입니다.

## 구조

```
design-system/
├── theme/           # 테마 시스템
│   ├── colors.ts    # 색상 정의
│   ├── spacing.ts   # 간격 시스템
│   ├── typography.ts # 타이포그래피
│   ├── borderRadius.ts # 테두리 반경
│   ├── shadows.ts   # 그림자 시스템
│   └── index.ts     # 테마 통합
├── components/      # 공통 컴포넌트
│   ├── Button.tsx   # 버튼 컴포넌트
│   ├── Card.tsx     # 카드 컴포넌트
│   ├── Text.tsx     # 텍스트 컴포넌트
│   ├── Input.tsx    # 입력 컴포넌트
│   └── index.ts     # 컴포넌트 통합
├── layouts/         # 레이아웃 컴포넌트
│   ├── Container.tsx # 컨테이너
│   ├── Row.tsx      # 행 레이아웃
│   ├── Column.tsx   # 열 레이아웃
│   └── index.ts     # 레이아웃 통합
├── animations/      # 애니메이션 컴포넌트
│   ├── FadeIn.tsx   # 페이드인
│   ├── SlideIn.tsx  # 슬라이드인
│   ├── ScaleIn.tsx  # 스케일인
│   └── index.ts     # 애니메이션 통합
├── styles/          # 리팩토링된 스타일
│   ├── HomeStyles.ts        # 홈 화면 스타일
│   ├── ExhibitionStyles.ts  # 전시 상세 스타일
│   ├── TopBarStyles.ts      # 상단 바 스타일
│   ├── SkeletonStyles.ts    # 스켈레톤 스타일
│   └── index.ts             # 스타일 통합
├── examples/        # 사용 예시
│   ├── DesignSystemDemo.tsx # 디자인 시스템 데모
│   └── index.ts             # 예시 통합
├── README.md        # 사용법 가이드
└── index.ts         # 메인 인덱스
```

## 사용법

### 1. 테마 시스템

```typescript
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "@/design-system/theme";

// 색상 사용
const primaryColor = Colors.primary.main;

// 간격 사용
const padding = Spacing.md;

// 타이포그래피 사용
const titleStyle = {
  fontSize: Typography.text.h1.fontSize,
  fontWeight: Typography.text.h1.fontWeight,
};
```

### 2. 공통 컴포넌트

```typescript
import { Button, Card, Text, Input } from '@/design-system/components';

// 버튼 사용
<Button
  title="클릭하세요"
  variant="primary"
  size="medium"
  onPress={() => {}}
/>

// 카드 사용
<Card variant="elevated" padding="medium">
  <Text variant="h2">제목</Text>
  <Text variant="body">내용</Text>
</Card>

// 텍스트 사용
<Text variant="h1" color="primary" align="center">
  메인 제목
</Text>

// 입력 필드 사용
<Input
  label="이메일"
  placeholder="이메일을 입력하세요"
  variant="outlined"
/>
```

### 3. 레이아웃 컴포넌트

```typescript
import { Container, Row, Column } from '@/design-system/layouts';

// 컨테이너 사용
<Container variant="safe" padding="medium">
  <Column align="center" gap="md">
    <Text variant="h1">제목</Text>
    <Text variant="body">내용</Text>
  </Column>
</Container>

// 행 레이아웃 사용
<Row justify="space-between" align="center" gap="md">
  <Button title="취소" variant="outline" />
  <Button title="확인" variant="primary" />
</Row>
```

### 4. 애니메이션 컴포넌트

```typescript
import { FadeIn, SlideIn, ScaleIn } from '@/design-system/animations';

// 페이드인 애니메이션
<FadeIn duration={500} delay={200}>
  <Text>페이드인 텍스트</Text>
</FadeIn>

// 슬라이드인 애니메이션
<SlideIn direction="up" distance={100} duration={300}>
  <Card>슬라이드인 카드</Card>
</SlideIn>

// 스케일인 애니메이션
<ScaleIn scale={0.5} duration={400}>
  <Button title="스케일인 버튼" />
</ScaleIn>
```

## 테마 지원

디자인 시스템은 라이트/다크 테마를 지원합니다:

```typescript
import { getThemeColors } from "@/design-system/theme";

const themeColors = getThemeColors("dark");
const backgroundColor = themeColors.background;
const textColor = themeColors.text.primary;
```

## 기존 코드 마이그레이션

기존 스타일 코드를 디자인 시스템으로 마이그레이션할 때:

1. 하드코딩된 색상값을 `Colors` 상수로 교체
2. 하드코딩된 간격값을 `Spacing` 상수로 교체
3. 하드코딩된 폰트 크기를 `Typography` 상수로 교체
4. 공통 컴포넌트를 디자인 시스템 컴포넌트로 교체

## 가이드라인

- 모든 새로운 컴포넌트는 디자인 시스템을 사용해야 합니다
- 하드코딩된 스타일값은 피하고 테마 상수를 사용하세요
- 일관된 간격과 색상을 유지하세요
- 접근성을 고려한 색상 대비를 유지하세요
