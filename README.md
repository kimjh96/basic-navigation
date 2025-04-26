![Banner(basic-navigation)](https://github.com/user-attachments/assets/2661452e-a695-48dc-9210-bf93d6577662)

# basic-navigation

모바일 환경에 최적화된 React 네비게이션 라이브러리로, 기본적인 라우팅과 다양한 화면 전환 효과를 제공해요!

<p align="center">
    <img src="https://img.shields.io/npm/v/basic-navigation?style=flat-square&labelColor=%2360758B&color=%23004ECC" alt="basic-navigation version"/>
    <img src="https://img.shields.io/github/license/kimjh96/basic-navigation?style=flat-square" alt="license" />
</p>


## 특징

📱 모바일 최적화 전환 효과 지원

🔙 스와이프 백 이전 화면 복귀 지원

🔄 스크롤 위치 복원

🛠 앱바(AppBar) 및 하단 네비게이션 바 내장 지원


## 시작하기

### 설치

```bash
npm install basic-navigation
# 또는
yarn add basic-navigation
# 또는
pnpm add basic-navigation
# 또는
bun add basic-navigation
```

### 기본 라우팅

<a href="https://github.com/pillarjs/path-to-regexp">path-to-regexp</a> 기반의 라우팅 패턴을 지원해요.

```tsx
import { Router, Route } from 'basic-navigation';

function App() {
  return (
    <Router>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/*path" element={<NotFound />} />
    </Router>
  );
}
```

### 화면 전환 효과 준비

```tsx
import { AppScreen } from 'basic-navigation';

function Home() {
  return (
    <AppScreen
      appBar={<AppBar />} // 선택
      bottomNavigationBar={<BottomNavigation />} // 선택
    >
      <Button>내 정보</Button>
    </AppScreen>
  );
}
```

### 서버 사이드 렌더링 환경 초기 경로 설정

```tsx
import { Router, Route } from 'basic-navigation';

function App({ initPath }: { initPath: string }) {
  return (
    <Router initPath={initPath}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Router>
  );
}
```

## API

### Router

라우팅 컨텍스트를 제공하는 컴포넌트예요.

```tsx
<Router>
  {/* 라우트 컴포넌트 */}
</Router>
```

### Route

특정 경로에 대한 컴포넌트를 렌더링해요.

```tsx
<Route path="/users/:id" activity={<UserProfile />} />
```

### AppScreen

화면 전환 효과를 지원하는 컨테이너 컴포넌트예요.

```tsx
<AppScreen
  appBar={<AppBar title="제목" />}
  appBarHeight={56}
  bottomNavigationBar={<BottomNavigation />}
  bottomNavigationBarHeight={56}
  backgroundColor="white"
>
  {/* 화면 내용 */}
</AppScreen>
```

### useNavigation

네비게이션 기능을 제공하는 훅이에요.

```tsx
import { useNavigation } from 'basic-navigation';

function Home() {
  const navigation = useNavigation();

  const handleClick = () => {
    // 새로운 화면으로 이동
    navigation.push('/about');
    
    // 애니메이션 없이 이동
    navigation.push('/about', { animate: false });
    
    // 특정 애니메이션으로 이동
    navigation.push('/about', { 
      animate: true,
      animationType: 'slide' // 'slide', 'fade', 'fade-left', 'fade-right', 'breath'
    });
    
    // 이전 화면으로 돌아가기
    navigation.pop();
    
    // 특정 화면으로 교체
    navigation.replace('/profile');
  };

  return (
    <AppScreen>
      <Button onClick={handleClick}>이동하기</Button>
    </AppScreen>
  );
}
```

### useParams

라우트 파라미터를 가져오는 훅이에요.

```tsx
import { useParams } from 'basic-navigation';

function UserProfile() {
  const params = useParams();
  // params.id로 사용자 ID에 접근 가능

  return (
    <AppScreen>
      <div>사용자 ID: {params.id}</div>
    </AppScreen>
  );
}
```

## TypeScript

타입스크립트를 사용하여 네비게이션에 타입 안정성을 확보할 수 있어요.

```tsx
// types.d.ts 또는 원하는 타입 선언 파일에 정의해요
import 'basic-navigation';

declare module "basic-navigation" {
    export interface BaseActivity {
        name: 'HomeActivity' | 'ProductActivity';
    }
    export interface BaseActivityPath {
        HomeActivity: '/';
        ProductActivity: '/product/:id'
    }
    export interface BaseActivityParams {
        ProductActivity: {
            id: string;
        }
    }
}
```

이를 통해 다음과 같이 타입 안전성이 보장돼요.

```tsx
import { useNavigation } from 'basic-navigation';

function Home() {
  const navigation = useNavigation();
  
  // 타입 시스템을 통한 안전한 네비게이션
  navigation.push('ProductActivity', { id: '123' }); // ✅
  navigation.push('ProductActivity', {}); // 타입 오류: id 파라미터가 필요해요
  navigation.push('UnknownActivity'); // 타입 오류: 정의되지 않은 화면이에요
}
```

이러한 타입 시스템 활용으로 개발 단계에서 잘못된 라우팅 경로나 누락된 파라미터로 인한 오류를 사전에 방지할 수 있어요.

## Example

[Shiflo](https://github.com/shiflo/shiflo-web)

## License

MIT
