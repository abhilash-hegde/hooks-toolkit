# Hooks Toolkit

![npm](https://img.shields.io/npm/v/hooks-toolkit)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/hooks-toolkit)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/npm/l/hooks-toolkit)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

## Introduction
**Hooks Toolkit** is a collection of powerful and reusable React hooks to simplify state management, API calls, event listeners, and more. Built with **TypeScript** and optimized for **React 19**.

## 🚀 Features

- **Lightweight & Fast**: Tree-shakable, zero dependencies
- **TypeScript**: Full type safety and IntelliSense support
- **React 19 Ready**: Optimized for the latest React features
- **Comprehensive**: 35+ hooks for common use cases
- **Well-documented**: Clear examples and API references
- **Unique Hooks**: Specialized hooks not found in other libraries

## 📦 Installation

```sh
npm install hooks-toolkit
```

or with Yarn:
```sh
yarn add hooks-toolkit
```


## Usage Example
```tsx
import { useAsync } from "hooks-toolkit";

const fetchData = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return res.json();
};

function App() {
  const { data, isPending, isSuccess, isError } = useAsync(fetchData, true);

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default App;
```

## Available Hooks
### `useAsync`
Handles asynchronous operations with built-in loading and error states.
```tsx
const { data, isPending, isSuccess, isError, execute } = useAsync(fetchData, true);
```

### `useDebounce`
Delays execution of a function until after a specified delay.
```tsx
const debouncedValue = useDebounce(value, 500);
```

### `useThrottle`
Limits the execution of a function to once every specified time interval.
```tsx
const throttledFunction = useThrottle(callback, 1000);
```

### `useLocalStorage`
Manages state with localStorage persistence.
```tsx
const [storedValue, setStoredValue] = useLocalStorage("key", "defaultValue");
```

### `useEventListener`
Adds and cleans up event listeners efficiently.
```tsx
useEventListener("resize", handleResize);
```

### `useOnClickOutside`
Detects clicks outside a specified element.
```tsx
const ref = useRef(null);
useOnClickOutside(ref, () => console.log("Clicked outside!"));
```

### `usePrevious`
Retrieves the previous state or prop value.
```tsx
const previousValue = usePrevious(currentValue);
```

...and many more!

## Contributing
PRs are welcome! 🎉 If you'd like to contribute, please check our [Contributing Guide](CONTRIBUTING.md).

## License
This project is licensed under the **MIT License**.

