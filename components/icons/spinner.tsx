import { FC } from 'react'

interface SpinnerProps {
	className?: string
}

const Spinner: FC<SpinnerProps> = ({ className }) => (
	<i
		className={`i-[svg-spinners--clock] h-4 w-4 text-blue-600 ${className}`}
	></i>
)

export default Spinner
