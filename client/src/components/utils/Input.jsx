import { useId, forwardRef } from 'react'

const Input = forwardRef(({ label, ...props }, ref) => {
	const id = useId()
	return (
		<div>
			{label && (
				<label htmlFor={id} style={{ display: 'block' }}>
					{label}
				</label>
			)}
			<input {...props} id={id} ref={ref} />
		</div>
	)
})

Input.displayName = 'Input'

export default Input
