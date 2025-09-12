export interface JobListing {
  id: string
  title: string
  website: string
  url: string
  description: string
  created_at: string
  published_at: string
  education_requirements?: string
}

export interface JobSearchParams {
  query?: string
  location?: string
  jobType?: string
  experience?: string
  remote?: boolean
  page?: number
  limit?: number
}

export async function getJobListings(params: JobSearchParams = {}): Promise<JobListing[]> {
  try {
    const {
      query = "",
      location = "",
      jobType = "",
      experience = "",
      remote = false,
      page = 1,
      limit = 20
    } = params

    // Build query parameters
    const searchParams = new URLSearchParams({
      query: query || "software engineer",
      location: location || "",
      job_type: jobType || "",
      experience: experience || "",
      remote: remote.toString(),
      page: page.toString(),
      limit: limit.toString()
    })

    // For now, simulate API call with realistic data structure
    // In production, this would call the actual jobs API
    console.log("Fetching job listings with params:", params)

    return new Promise<JobListing[]>((resolve) => {
      setTimeout(() => {
        // Simulate realistic job data based on the provided API structure
        const mockJobs: JobListing[] = [
          {
            id: "68c453052715058d7507c967",
            title: "Sr Machine Learning Engineer at PayPal Inc. in San Jose, California",
            website: "www.disabledperson.com",
            url: "https://www.disabledperson.com/jobs/67702050-sr-machine-learning-engineer",
            description: "Job Description:\nThe Company\n\nPayPal has been revolutionizing commerce globally for more than 25 years. Creating innovative experiences that make moving money, selling, and shopping simple, personalized, and secure, PayPal empowers consumers and businesses in approximately 200 markets to join and thrive in the global economy.\n\nJob Summary:\nThis job will design, develop, and implement machine learning models and algorithms to solve complex problems. You will work closely with data scientists, software engineers, and product teams to enhance services through innovative AI/ML solutions.",
            created_at: "2025-09-12T17:06:13.934Z",
            published_at: "2025-09-12T17:06:13.514Z",
            education_requirements: "Minimum of 5 years of relevant work experience and a Bachelor's degree or equivalent experience. Experience with ML frameworks like TensorFlow, PyTorch, or scikit-learn."
          },
          {
            id: "68c453052715058d7507c968",
            title: "Frontend Developer at Google in Mountain View, California",
            website: "www.google.com",
            url: "https://careers.google.com/jobs/results/1234567890",
            description: "We are looking for a Frontend Developer to join our team. You will be responsible for building user-facing features and ensuring the best possible user experience. You will work with a team of engineers to design and implement new features and improve existing ones.",
            created_at: "2025-09-12T16:30:00.000Z",
            published_at: "2025-09-12T16:30:00.000Z",
            education_requirements: "Bachelor's degree in Computer Science or related field. 3+ years of experience with React, TypeScript, and modern frontend technologies."
          },
          {
            id: "68c453052715058d7507c969",
            title: "UX Designer at Apple in Cupertino, California",
            website: "www.apple.com",
            url: "https://jobs.apple.com/en-us/details/200123456",
            description: "Apple is looking for a UX Designer to join our design team. You will be responsible for creating intuitive and beautiful user experiences across our product ecosystem. You will work closely with product managers, engineers, and other designers to bring ideas to life.",
            created_at: "2025-09-12T15:45:00.000Z",
            published_at: "2025-09-12T15:45:00.000Z",
            education_requirements: "Bachelor's degree in Design, Human-Computer Interaction, or related field. 2+ years of experience in UX design with a strong portfolio."
          },
          {
            id: "68c453052715058d7507c970",
            title: "Data Scientist at Microsoft in Seattle, Washington",
            website: "www.microsoft.com",
            url: "https://careers.microsoft.com/us/en/job/1234567",
            description: "Microsoft is seeking a Data Scientist to join our analytics team. You will be responsible for analyzing large datasets, building predictive models, and providing insights to drive business decisions. You will work with cross-functional teams to solve complex problems using data science techniques.",
            created_at: "2025-09-12T14:20:00.000Z",
            published_at: "2025-09-12T14:20:00.000Z",
            education_requirements: "Master's degree in Statistics, Mathematics, Computer Science, or related field. 4+ years of experience in data science and machine learning."
          },
          {
            id: "68c453052715058d7507c971",
            title: "Product Manager at Amazon in Seattle, Washington",
            website: "www.amazon.com",
            url: "https://www.amazon.jobs/en/jobs/1234567",
            description: "Amazon is looking for a Product Manager to join our product team. You will be responsible for defining product strategy, working with engineering teams to deliver features, and collaborating with stakeholders across the organization. You will drive product decisions based on data and customer feedback.",
            created_at: "2025-09-12T13:15:00.000Z",
            published_at: "2025-09-12T13:15:00.000Z",
            education_requirements: "Bachelor's degree in Business, Engineering, or related field. 5+ years of product management experience in technology companies."
          },{  
            id: "68c453052715058d7507c972",  
            title: "Cloud Solutions Architect at IBM in New York, New York",  
            website: "www.ibm.com",  
            url: "https://careers.ibm.com/job/123456789",  
            description: "IBM is hiring a Cloud Solutions Architect to design and implement scalable, secure, and cost-effective cloud-based solutions. You will collaborate with clients, engineers, and stakeholders to define cloud strategies and deliver cutting-edge architectures.",  
            created_at: "2025-09-12T12:30:00.000Z",  
            published_at: "2025-09-12T12:30:00.000Z",  
            education_requirements: "Bachelor's degree in Computer Science or related field. 7+ years of experience in cloud architecture with AWS, Azure, or Google Cloud."  
          },  
          {  
            id: "68c453052715058d7507c973",  
            title: "Cybersecurity Analyst at Cisco in San Jose, California",  
            website: "www.cisco.com",  
            url: "https://jobs.cisco.com/jobs/12345678",  
            description: "Cisco is seeking a Cybersecurity Analyst to monitor, detect, and respond to security incidents. You will work on threat analysis, vulnerability management, and building secure systems to protect critical infrastructure.",  
            created_at: "2025-09-12T11:15:00.000Z",  
            published_at: "2025-09-12T11:15:00.000Z",  
            education_requirements: "Bachelor's degree in Cybersecurity, Information Technology, or related field. 3+ years of experience in security operations or incident response."  
          },  
          {  
            id: "68c453052715058d7507c974",  
            title: "AI Research Scientist at OpenAI in San Francisco, California",  
            website: "www.openai.com",  
            url: "https://openai.com/careers/research-scientist",  
            description: "OpenAI is hiring an AI Research Scientist to advance the field of artificial intelligence through cutting-edge research. You will develop novel algorithms, publish papers, and collaborate with a team of world-class researchers.",  
            created_at: "2025-09-12T10:00:00.000Z",  
            published_at: "2025-09-12T10:00:00.000Z",  
            education_requirements: "PhD in Computer Science, Machine Learning, or related field. Strong publication record in AI/ML conferences or journals."  
          },  
          {  
            id: "68c453052715058d7507c975",  
            title: "Mobile App Developer at Spotify in Los Angeles, California",  
            website: "www.spotify.com",  
            url: "https://www.spotifyjobs.com/job/123456789",  
            description: "Spotify is looking for a Mobile App Developer to build and maintain features for our Android and iOS applications. You will work closely with designers and backend engineers to deliver seamless music experiences.",  
            created_at: "2025-09-12T09:00:00.000Z",  
            published_at: "2025-09-12T09:00:00.000Z",  
            education_requirements: "Bachelor's degree in Computer Science or related field. 4+ years of mobile development experience with Swift, Kotlin, or React Native."  
          },  
          {  
            id: "68c453052715058d7507c976",  
            title: "Digital Marketing Specialist at Meta in Menlo Park, California",  
            website: "www.metacareers.com",  
            url: "https://www.metacareers.com/jobs/123456789",  
            description: "Meta is hiring a Digital Marketing Specialist to create and optimize campaigns across social media platforms. You will analyze campaign performance, manage budgets, and work with creative teams to maximize ROI.",  
            created_at: "2025-09-12T08:00:00.000Z",  
            published_at: "2025-09-12T08:00:00.000Z",  
            education_requirements: "Bachelor's degree in Marketing, Business, or related field. 2+ years of experience in digital marketing, SEO, or paid media campaigns."  
          }  
          
        ]

        // Filter jobs based on search parameters
        let filteredJobs = mockJobs

        if (query) {
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.description.toLowerCase().includes(query.toLowerCase())
          )
        }

        if (location) {
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(location.toLowerCase())
          )
        }

        if (jobType) {
          const typeKeywords = {
            'full-time': ['senior', 'sr', 'lead', 'principal'],
            'part-time': ['part-time', 'contractor'],
            'internship': ['intern', 'internship'],
            'contract': ['contract', 'freelance']
          }
          
          const keywords = typeKeywords[jobType as keyof typeof typeKeywords] || []
          filteredJobs = filteredJobs.filter(job => 
            keywords.some(keyword => job.title.toLowerCase().includes(keyword))
          )
        }

        resolve(filteredJobs)
      }, 800)
    })
  } catch (error) {
    console.error("Failed to fetch job listings:", error)
    throw new Error("Failed to load job listings. Please try again.")
  }
}

export async function getJobDetails(jobId: string): Promise<JobListing | null> {
  try {
    const jobs = await getJobListings()
    return jobs.find(job => job.id === jobId) || null
  } catch (error) {
    console.error("Failed to fetch job details:", error)
    return null
  }
}
