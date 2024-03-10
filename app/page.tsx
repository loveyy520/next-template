import CardWithForm from '@/components/hover-card-demo'

export default function Home() {
	return (
		<main className='h-screen'>
			<i className='i-[mdi-light--arrow-left] hover:ih-[mdi-light--arrow-right]'></i>
			<CardWithForm />
		</main>
	)
}
