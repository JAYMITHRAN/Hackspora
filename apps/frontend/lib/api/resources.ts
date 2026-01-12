export interface LearningResource {
  id: string
  title: string
  provider: string
  type: "course" | "video" | "article" | "certification"
  duration: string
  rating: number
  url: string
  thumbnail: string
  price: string
}

export async function getCareerResources(careerId: string) {
  // Stub for backend integration
  console.log("Fetching resources for career:", careerId)

  // Simulate API call with dummy data
  return new Promise<LearningResource[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "ux-course-1",
          title: "Complete UX Design Bootcamp",
          provider: "Coursera",
          type: "course",
          duration: "6 weeks",
          rating: 4.8,
          url: "#",
          thumbnail: "/ux-design-course.png",
          price: "$49/month",
        },
        {
          id: "design-thinking-1",
          title: "Design Thinking Fundamentals",
          provider: "YouTube",
          type: "video",
          duration: "2 hours",
          rating: 4.6,
          url: "#",
          thumbnail: "/design-thinking-video.jpg",
          price: "Free",
        },
        {
          id: "figma-cert-1",
          title: "Figma Professional Certification",
          provider: "Udemy",
          type: "certification",
          duration: "4 weeks",
          rating: 4.7,
          url: "#",
          thumbnail: "/figma-certification.jpg",
          price: "$89.99",
        },
      ])
    }, 600)
  })
}
