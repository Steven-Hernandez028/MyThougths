import React from "react"

type Props = React.ComponentProps<"div"> & {
  /** Optional name prop mimicking the experimental API */
  name?: string
}

/**
 * Safe wrapper around React's experimental <ViewTransition>.
 * If the API is unavailable it simply renders the children.
 */
export function ViewTransition({ children, ...rest }: Props) {
  // @ts-ignore – property exists only in experimental builds
  const ExperimentalVT = (React as any).unstable_ViewTransition

  if (ExperimentalVT) {
    // @ts-ignore – spread extra props to experimental component
    return <ExperimentalVT {...rest}>{children}</ExperimentalVT>
  }

  // Fallback: no-op wrapper
  return <>{children}</>
}
