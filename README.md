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


# Hooks Toolkit Documentation

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


## Hooks List

| Hook Name               | Category           | Use Case |
|-------------------------|-------------------|----------|
| `useClickOutside`       | UI/DOM Hooks      | Detects clicks outside a specified element |
| `useWindowSize`        | UI/DOM Hooks      | Retrieves the current window size |
| `useMediaQuery`        | UI/DOM Hooks      | Matches media queries dynamically |
| `useLocalStorage`      | State Management  | Stores and retrieves values from localStorage |
| `useSessionStorage`    | State Management  | Stores and retrieves values from sessionStorage |
| `useToggle`           | State Management  | Toggles a boolean value |
| `useDebounce`         | Performance       | Delays function execution until after a timeout |
| `useThrottle`         | Performance       | Ensures function execution happens at most once in a time interval |
| `useMemoCompare`      | Performance       | Compares memoized values efficiently |
| `useGeolocation`      | Browser API       | Retrieves user geolocation data |
| `useOnlineStatus`     | Browser API       | Detects online/offline status of the user |
| `useDocumentTitle`    | Browser API       | Updates the document title dynamically |
| `useForm`            | Form Hooks        | Manages form state and validation |
| `useInput`           | Form Hooks        | Handles controlled input elements |
| `useFetch`           | Data Fetching     | Fetches data using the Fetch API |
| `useAsync`           | Data Fetching     | Handles async operations with built-in states |
| `useAnimation`       | Animation Hooks   | Handles animations using requestAnimationFrame |
| `useIntersectionObserver` | Animation Hooks | Detects when an element enters the viewport |
| `useImageLoad`       | Media Hooks       | Tracks the loading state of an image |
| `useAudio`           | Media Hooks       | Manages audio playback |
| `useVideo`           | Media Hooks       | Manages video playback |
| `useMount`           | Lifecycle Hooks   | Runs effect on component mount |
| `useUnmount`         | Lifecycle Hooks   | Runs effect on component unmount |
| `useUpdateEffect`    | Lifecycle Hooks   | Runs effect only when dependencies update |
| `useCopyToClipboard` | Utility Hooks     | Copies text to the clipboard |
| `useEventListener`   | Utility Hooks     | Attaches event listeners to elements |
| `useHover`          | Utility Hooks     | Detects hover state of an element |
| `useKeyPress`       | Utility Hooks     | Detects key presses |
| `useInterval`       | Utility Hooks     | Runs an interval function |
| `useTimeout`        | Utility Hooks     | Runs a timeout function |
| `useScrollPosition` | Utility Hooks     | Tracks scroll position |
| `useContextMenu`    | Utility Hooks     | Handles right-click context menus |
| `useClipboard`      | Utility Hooks     | Manages clipboard actions |
| `useRenderCount`    | Utility Hooks     | Counts the number of renders |
| `useIsMounted`      | Utility Hooks     | Checks if a component is mounted |
| `usePrevious`       | Utility Hooks     | Retrieves the previous state value |
| `useStateWithHistory` | Utility Hooks   | Stores state history for undo/redo |



## UI/DOM Hooks

### `useClickOutside`
Detects clicks outside a specified element.
```tsx
const ref = useRef(null);
useClickOutside(ref, () => console.log("Clicked outside!"));
```

### `useWindowSize`
Retrieves the current window size.
```tsx
const { width, height } = useWindowSize();
```

### `useMediaQuery`
Checks if a media query matches.
```tsx
const isMobile = useMediaQuery("(max-width: 768px)");
```

---

## State Management Hooks

### `useLocalStorage`
Manages state with localStorage persistence.
```tsx
const [value, setValue] = useLocalStorage("key", "defaultValue");
```

### `useSessionStorage`
Manages state with sessionStorage persistence.
```tsx
const [value, setValue] = useSessionStorage("key", "defaultValue");
```

### `useToggle`
Handles boolean state toggling.
```tsx
const [isOn, toggle] = useToggle(false);
```

---

## Performance Hooks

### `useDebounce`
Delays function execution until after a timeout.
```tsx
const debouncedValue = useDebounce(value, 500);
```

### `useThrottle`
Limits function execution frequency.
```tsx
const throttledFunction = useThrottle(callback, 1000);
```

### `useMemoCompare`
Memoizes a value with deep comparison.
```tsx
const memoizedValue = useMemoCompare(value, (prev, next) => isEqual(prev, next));
```

---

## Browser API Hooks

### `useGeolocation`
Gets the user's geolocation.
```tsx
const { latitude, longitude } = useGeolocation();
```

### `useOnlineStatus`
Detects online/offline status.
```tsx
const isOnline = useOnlineStatus();
```

### `useDocumentTitle`
Dynamically updates the document title.
```tsx
useDocumentTitle("My Page Title");
```

---

## Form Hooks

### `useForm`
Handles form state.
```tsx
const { state, { handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, resetForm } } = useForm(initialState, onSubmit);
```

### `useInput`
Handles controlled input state.
```tsx
const { value, onChange, onBlur, onFocus, reset, isTouched } = useInput("");
```

---

## Data Fetching Hooks

### `useFetch`
Fetches data with built-in loading/error states.
```tsx
const { data, loading, error, refetch } = useFetch("https://api.example.com");
```

### `useAsync`
Handles async operations with status tracking.
```tsx
const { status, data, execute, isIdle, isPending, isSuccess, isError } = useAsync(fetchData, true);
```

---

## Animation Hooks

### `useAnimation`
Manages animation frame loops.
```tsx
useAnimation((deltaTime) => console.log(deltaTime));
```

### `useIntersectionObserver`
Observes an element's visibility in the viewport.
```tsx
const [ref, isVisible] = useIntersectionObserver();
```

---

## Media Hooks

### `useImageLoad`
Detects when an image has loaded.
```tsx
const { isLoading, isLoaded, error } = useImageLoad(imageUrl);
```

### `useAudio`
Handles audio playback state.
```tsx
const [ state, controls ] = useAudio(audioUrl);
```

### `useVideo`
Controls video playback.
```tsx
const [ state, controls ] = useVideo(videoRef);
```

---

## Lifecycle Hooks

### `useMount`
Runs a function on component mount.
```tsx
useMount(() => console.log("Mounted"));
```

### `useUnmount`
Runs a function on component unmount.
```tsx
useUnmount(() => console.log("Unmounted"));
```

### `useUpdateEffect`
Runs only on state updates (not on mount).
```tsx
useUpdateEffect(() => console.log("Updated"), [value]);
```

---

## Miscellaneous Utility Hooks

### `useCopyToClipboard`
Copies text to the clipboard.
```tsx
const [state, copy] = useCopyToClipboard();
```

### `useEventListener`
Adds event listeners with automatic cleanup.
```tsx
useEventListener("click", handleClick);
```

### `useHover`
Detects hover state.
```tsx
const [ref, isHovered] = useHover();
```

### `useKeyPress`
Detects key presses.
```tsx
const isEnterPressed = useKeyPress("Enter");
```

### `useInterval`
Runs a function at a set interval.
```tsx
useInterval(() => console.log("Tick"), 1000);
```

### `useTimeout`
Delays function execution.
```tsx
const { reset, clear } = useTimeout(() => console.log("Timeout!"), 3000);
```

### `useScrollPosition`
Tracks the scroll position.
```tsx
const { x, y } = useScrollPosition();
```

### `useContextMenu`
Handles custom context menu events.
```tsx
const { visible, x, y, show, hide } = useContextMenu();
```

### `useClipboard`
Manages clipboard interactions.
```tsx
const { state, copy } = useClipboard();
```

### `useRenderCount`
Counts component re-renders.
```tsx
const count = useRenderCount();
```

### `useIsMounted`
Checks if a component is mounted.
```tsx
const isMounted = useIsMounted();
```

### `usePrevious`
Gets the previous state or prop value.
```tsx
const previousValue = usePrevious(currentValue);
```

### `useStateWithHistory`
Tracks state history.
```tsx
const [state, setState, history, pointer, back, forward, go] = useStateWithHistory(initialValue);
```


## Contributing
PRs are welcome! 🎉 If you'd like to contribute, please check our [Contributing Guide](CONTRIBUTING.md).

## License
This project is licensed under the **MIT License**.

