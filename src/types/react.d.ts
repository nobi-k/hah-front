declare module 'react' {
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
  
  export interface ReactNode {
    // React node type
  }
  
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  
  export const StrictMode: FC<{ children: ReactNode }>;
}

declare module 'react-dom/client' {
  export interface Root {
    render(element: JSX.Element): void;
  }
  
  export function createRoot(container: Element | DocumentFragment): Root;
}

declare global {
  namespace JSX {
    interface Element {
      type: any;
      props: any;
      key?: string | number | null;
    }
    
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
