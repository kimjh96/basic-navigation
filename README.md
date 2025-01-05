![Banner(basic-navigation)](https://github.com/user-attachments/assets/2661452e-a695-48dc-9210-bf93d6577662)

basic-navigation 은 모바일 웹을 위한 기초적인 라우팅 및 탐색을 제공하는 React 전용 라이브러리예요. 고급 기능이나 성능이 중요하지 않은 간단한 프로젝트라면 한 번 사용해 보세요!

<p align="center">
    <img src="https://img.shields.io/npm/v/basic-navigation?style=flat-square&labelColor=%2360758B&color=%23004ECC" alt="basic-navigation version"/>
    <img src="https://img.shields.io/github/license/kimjh96/basic-navigation?style=flat-square" alt="license" />
</p>

## 🚀 특징
- 간단한 사용
- 화면 전환 효과 지원
- Server-Side Rendering 지원

## 설치 및 시작
```bash
pnpm add basic-navigation
```

```tsx
import { Navigator, Navigate } from 'basic-naivgation';
import HomeActivity from '@activites/HomeActivity';
import ProductActivity from '@activites/ProductActivity'

function App() {
  return (
    <Navigator>
      <Navigate name={'HomeActivity'} path={'/'}>
        <HomeActivity />
      </Navigate>
      <Navigate name={'ProductActivity'} path={'/product/:id'}>
        <ProductActivity />
      </Navigate>
    </Navigator>
  );
}

export default App;
```

```tsx
import { SlideScreen } from 'basic-naivgation';

function HomeActivity() {
  return (
    <SlideScreen>
      Welcome HomeActivity
    </SlideScreen>
  );
}

export default HomeActivity;
```

## 예시
### 탐색
```tsx
import { SlideScreen, useNavigation } from 'basic-naivgation';

function HomeActivity() {
  const navigation = useNavigation();

  const handleClick = () => navigation.push('ProductActivity', { id: '1' });

  return (
    <SlideScreen>
      Welcome HomeActivity
      <button onClick={handleClick}>go to ProductActivity</button>
    </SlideScreen>
  );
}

export default HomeActivity;
```

```typescript
// with TypeScript

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
