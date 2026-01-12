import CareerDetailPage from "@/components/pages/CareerDetailPage"

interface CareerDetailProps {
  params: {
    id: string
  }
}

export default function CareerDetail({ params }: CareerDetailProps) {
  return <CareerDetailPage careerId={params.id} />
}
