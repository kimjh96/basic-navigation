![Banner(basic-navigation)](https://github.com/user-attachments/assets/2661452e-a695-48dc-9210-bf93d6577662)

basic-navigation 은 모바일 웹을 위한 기초적인 라우팅 및 탐색을 제공하는 React 전용 라이브러리예요. 고급 기능이나 성능이 중요하지 않은 간단한 프로젝트라면 한 번 사용해 보세요!

<p align="center">
    <img src="https://img.shields.io/npm/v/basic-navigation?style=flat-square&labelColor=%2360758B&color=%23004ECC" alt="basic-navigation version"/>
    <img src="https://img.shields.io/github/license/kimjh96/basic-navigation?style=flat-square" alt="license" />
</p>

## 🚀 특징
- 다양한 화면 전환 효과 지원
- Server-Side Rendering 지원

## 설치 및 시작
```bash
pnpm add basic-navigation
```

```tsx
import { Router, Route } from 'basic-naivgation';
import HomeActivity from '@activites/HomeActivity'; // your component
import ProductActivity from '@activites/ProductActivity'

function App() {
  return (
    <Router>
      <Route name={'HomeActivity'} path={'/'} activity={<HomeActivity />} />
      <Route name={'ProductActivity'} path={'/product/:id'} activity={<ProductActivity />} />
    </Router>
  );
}

export default App;
```

```tsx
import { AppScreen } from 'basic-naivgation';

function HomeActivity() {
  return (
    <AppScreen>
      HomeActivity
    </AppScreen>
  );
}

export default HomeActivity;
```

## 탐색
```tsx
import { AppScreen, useNavigation } from 'basic-naivgation';

function HomeActivity() {
  const navigation = useNavigation();

  const handleClick = () => navigation.push('ProductActivity', { id: '1' });

  return (
    <AppScreen>
      HomeActivity
      <button onClick={handleClick}>Go to ProductActivity</button>
    </AppScreen>
  );
}

export default HomeActivity;
```

## TypeScript
```typescript
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
