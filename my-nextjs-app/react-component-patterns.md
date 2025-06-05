# React コンポーネントの一般的な実装方法

## 基本的なコンポーネント構成

### 1. Functional Component（関数コンポーネント）

```tsx
// 基本形
const MyComponent = (): JSX.Element => {
  return <div>Hello World</div>;
};

// Props付き
interface Props {
  title: string;
  count?: number;
}

const MyComponent = ({ title, count = 0 }: Props): JSX.Element => {
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
    </div>
  );
};
```

### 2. Props でコンポーネントが受け取る引数を同ファイルに定義する

```tsx
// Props interfaceを同ファイル内で定義
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

// 複雑な型定義も同ファイル内
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
  loading?: boolean;
}

const UserList = ({
  users,
  onUserSelect,
  loading = false,
}: UserListProps): JSX.Element => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} onClick={() => onUserSelect(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
};
```

## コンポーネント設計パターン

### 1. Compound Components（複合コンポーネント）

```tsx
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
  children: React.ReactNode;
  defaultTab: string;
}

const Tabs = ({ children, defaultTab }: TabsProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: React.ReactNode;
}

const TabList = ({ children }: TabListProps): JSX.Element => {
  return <div className="tab-list">{children}</div>;
};

interface TabProps {
  value: string;
  children: React.ReactNode;
}

const Tab = ({ value, children }: TabProps): JSX.Element => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");

  const { activeTab, setActiveTab } = context;

  return (
    <button
      className={`tab ${activeTab === value ? "active" : ""}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

// 使用例
<Tabs defaultTab="tab1">
  <TabList>
    <Tab value="tab1">Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
  </TabList>
</Tabs>;
```

### 2. Render Props パターン

```tsx
interface RenderPropsComponentProps<T> {
  data: T[];
  render: (item: T, index: number) => React.ReactNode;
}

const List = <T,>({
  data,
  render,
}: RenderPropsComponentProps<T>): JSX.Element => {
  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>{render(item, index)}</li>
      ))}
    </ul>
  );
};

// 使用例
<List
  data={users}
  render={(user, index) => (
    <div>
      {index + 1}. {user.name} - {user.email}
    </div>
  )}
/>;
```

## パフォーマンス最適化

### 1. React.memo

```tsx
interface ExpensiveComponentProps {
  data: string[];
}

const ExpensiveComponent = React.memo(
  ({ data }: ExpensiveComponentProps): JSX.Element => {
    return (
      <div>
        {data.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    );
  }
);
```

## テスト

### 1. React Testing Library

```tsx
// コンポーネント
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: ButtonProps): JSX.Element => (
  <button onClick={onClick}>{children}</button>
);

// テスト
import { render, screen, fireEvent } from "@testing-library/react";

describe("Button", () => {
  it("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByText("Click me");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

## ベストプラクティス

### 1. Props 設計

```tsx
// Good
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  variant,
  size,
  children,
  onClick,
  disabled = false,
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Avoid
interface BadButtonProps {
  type?: string; // 曖昧
  click?: any; // 型が不明確
}
```
