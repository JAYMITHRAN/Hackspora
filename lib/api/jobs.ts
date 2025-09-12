export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "internship" | "contract"
  salaryRange: string
  postedDate: Date
  description: string
  requirements: string[]
  remote: boolean
}

export async function getJobListings(category?: string, type?: string) {
  // Stub for backend integration
  console.log("Fetching job listings:", { category, type })

  // Simulate API call with dummy data
  return new Promise<JobListing[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "job-1",
          title: "Junior UX Designer",
          company: "TechCorp",
          location: "San Francisco, CA",
          type: "full-time",
          salaryRange: "$65k - $85k",
          postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          description: "Join our design team to create amazing user experiences",
          requirements: ["1-2 years experience", "Figma proficiency", "Portfolio required"],
          remote: true,
        },
        {
          id: "job-2",
          title: "UX Design Intern",
          company: "StartupXYZ",
          location: "New York, NY",
          type: "internship",
          salaryRange: "$20/hour",
          postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          description: "Summer internship opportunity for aspiring UX designers",
          requirements: ["Currently enrolled in design program", "Basic design skills"],
          remote: false,
        },
      ])
    }, 700)
  })
}
