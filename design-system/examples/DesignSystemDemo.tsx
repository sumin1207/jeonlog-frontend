import React from "react";
import { ScrollView, View } from "react-native";
import { Container, Row, Column } from "../layouts";
import { Button, Card, Text, Input } from "../components";
import { FadeIn, SlideIn, ScaleIn } from "../animations";
import { Colors, Spacing, Typography } from "../theme";

export const DesignSystemDemo: React.FC = () => {
  return (
    <Container
      variant='safe'
      padding='medium'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FadeIn duration={500}>
          <Text
            variant='h1'
            color='primary'
            align='center'>
            디자인 시스템 데모
          </Text>
          <Text
            variant='body'
            color='secondary'
            align='center'>
            프로젝트의 모든 디자인 요소들을 확인해보세요
          </Text>
        </FadeIn>

        <SlideIn
          direction='up'
          delay={200}>
          <Card
            variant='elevated'
            padding='large'
            style={{ marginTop: Spacing.xl }}>
            <Text
              variant='h2'
              color='primary'
              style={{ marginBottom: Spacing.md }}>
              색상 시스템
            </Text>
            <Row
              wrap
              gap='sm'>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: Colors.primary.main,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  variant='caption'
                  color='inverse'>
                  Primary
                </Text>
              </View>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: Colors.secondary.main,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  variant='caption'
                  color='inverse'>
                  Secondary
                </Text>
              </View>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: Colors.status.success,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  variant='caption'
                  color='inverse'>
                  Success
                </Text>
              </View>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: Colors.status.warning,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  variant='caption'
                  color='inverse'>
                  Warning
                </Text>
              </View>
            </Row>
          </Card>
        </SlideIn>

        <SlideIn
          direction='up'
          delay={400}>
          <Card
            variant='outlined'
            padding='large'
            style={{ marginTop: Spacing.lg }}>
            <Text
              variant='h2'
              color='primary'
              style={{ marginBottom: Spacing.md }}>
              타이포그래피
            </Text>
            <Column gap='sm'>
              <Text variant='h1'>제목 1 (H1)</Text>
              <Text variant='h2'>제목 2 (H2)</Text>
              <Text variant='h3'>제목 3 (H3)</Text>
              <Text variant='h4'>제목 4 (H4)</Text>
              <Text variant='body'>본문 텍스트 (Body)</Text>
              <Text variant='bodySmall'>작은 본문 (Body Small)</Text>
              <Text variant='caption'>설명 텍스트 (Caption)</Text>
            </Column>
          </Card>
        </SlideIn>

        <SlideIn
          direction='up'
          delay={600}>
          <Card
            variant='filled'
            padding='large'
            style={{ marginTop: Spacing.lg }}>
            <Text
              variant='h2'
              color='primary'
              style={{ marginBottom: Spacing.md }}>
              버튼 컴포넌트
            </Text>
            <Column gap='md'>
              <Row
                justify='space-between'
                wrap
                gap='sm'>
                <Button
                  title='Primary'
                  variant='primary'
                  size='small'
                  onPress={() => {}}
                />
                <Button
                  title='Secondary'
                  variant='secondary'
                  size='small'
                  onPress={() => {}}
                />
                <Button
                  title='Outline'
                  variant='outline'
                  size='small'
                  onPress={() => {}}
                />
                <Button
                  title='Ghost'
                  variant='ghost'
                  size='small'
                  onPress={() => {}}
                />
              </Row>
              <Row
                justify='space-between'
                wrap
                gap='sm'>
                <Button
                  title='Small'
                  size='small'
                  onPress={() => {}}
                />
                <Button
                  title='Medium'
                  size='medium'
                  onPress={() => {}}
                />
                <Button
                  title='Large'
                  size='large'
                  onPress={() => {}}
                />
              </Row>
              <Button
                title='Full Width Button'
                variant='primary'
                fullWidth
                onPress={() => {}}
              />
            </Column>
          </Card>
        </SlideIn>

        <SlideIn
          direction='up'
          delay={800}>
          <Card
            variant='elevated'
            padding='large'
            style={{ marginTop: Spacing.lg }}>
            <Text
              variant='h2'
              color='primary'
              style={{ marginBottom: Spacing.md }}>
              입력 필드
            </Text>
            <Column gap='md'>
              <Input
                label='기본 입력'
                placeholder='텍스트를 입력하세요'
                variant='outlined'
              />
              <Input
                label='채워진 입력'
                placeholder='텍스트를 입력하세요'
                variant='filled'
              />
              <Input
                label='밑줄 입력'
                placeholder='텍스트를 입력하세요'
                variant='underlined'
              />
            </Column>
          </Card>
        </SlideIn>

        <SlideIn
          direction='up'
          delay={1000}>
          <Card
            variant='outlined'
            padding='large'
            style={{ marginTop: Spacing.lg }}>
            <Text
              variant='h2'
              color='primary'
              style={{ marginBottom: Spacing.md }}>
              애니메이션
            </Text>
            <Column gap='md'>
              <ScaleIn
                scale={0.8}
                duration={500}>
                <Button
                  title='스케일 애니메이션'
                  variant='secondary'
                  onPress={() => {}}
                />
              </ScaleIn>
              <FadeIn
                duration={800}
                delay={200}>
                <Text
                  variant='body'
                  color='secondary'>
                  이 텍스트는 페이드인 애니메이션과 함께 나타납니다
                </Text>
              </FadeIn>
            </Column>
          </Card>
        </SlideIn>

        <SlideIn
          direction='up'
          delay={1200}>
          <Card
            variant='filled'
            padding='large'
            style={{ marginTop: Spacing.lg, marginBottom: Spacing.xl }}>
            <Text
              variant='h2'
              color='primary'
              style={{ marginBottom: Spacing.md }}>
              간격 시스템
            </Text>
            <Column gap='md'>
              <Text variant='body'>xs: {Spacing.xs}px</Text>
              <Text variant='body'>sm: {Spacing.sm}px</Text>
              <Text variant='body'>md: {Spacing.md}px</Text>
              <Text variant='body'>lg: {Spacing.lg}px</Text>
              <Text variant='body'>xl: {Spacing.xl}px</Text>
              <Text variant='body'>xxl: {Spacing.xxl}px</Text>
            </Column>
          </Card>
        </SlideIn>
      </ScrollView>
    </Container>
  );
};
