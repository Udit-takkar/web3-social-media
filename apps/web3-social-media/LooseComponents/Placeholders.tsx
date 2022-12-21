import { css, keyframes } from '@emotion/css'

export function Placeholders({
    number: number = 0
}) {
    const rows = []
    for (let i = 0; i < number; i++) {
        rows.push(
            <div
                className={grayLoadingStyle}
                key={i}
            />
        )
    }
    return <div>{rows}</div>
}

const shimmer = keyframes`
  from {
    opacity: .2;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: .2;
  }
`

const grayLoadingStyle = css`
  background-color: rgba(0, 0, 0, .1);
  height: 115px;
  width: 100%;
  margin-top: 13px;
  border-radius: 7px;
  animation: ${shimmer} 2s infinite linear;
`