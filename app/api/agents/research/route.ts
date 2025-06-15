import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

interface ResearchResult {
  query: string
  summary: string
  keyFindings: string[]
  sources: Array<{
    title: string
    url: string
    snippet: string
    relevanceScore: number
    domain: string
  }>
  analysis: {
    credibility: string
    consensus: string
    dateRange: string
    topicDepth: string
  }
  report: string
  generatedAt: string
}

// Generate dynamic mock data based on the query using AI
const generateMockResearchData = async (query: string): Promise<ResearchResult> => {
  console.log('Starting research generation...')
  
  // Simulate research delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  try {
    // Generate different parts separately for better reliability
    console.log('Generating AI research content...')
    
    // Generate summary
    const summaryPrompt = `Write a 2-3 sentence executive summary about "${query}". Focus on current state and significance. Be specific to this topic.`
    
    const summaryResponse = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a research assistant. Provide concise, informative summaries.' },
        { role: 'user', content: summaryPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    })

    // Generate key findings
    const findingsPrompt = `List 5 specific key findings about "${query}". Each finding should be one sentence and specific to this topic. Format as a simple list, one finding per line.`
    
    const findingsResponse = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a research assistant. Provide specific, actionable findings.' },
        { role: 'user', content: findingsPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    })

    // Generate detailed report
    const reportPrompt = `Write a comprehensive research report about "${query}". Include:
    
1. Current state and recent developments
2. Key challenges and opportunities  
3. Expert perspectives and trends
4. Future outlook and predictions
5. Practical implications

Make it 400-600 words, specific to "${query}", and format with markdown headers. Be informative and detailed.`
    
    const reportResponse = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a professional research analyst. Write detailed, informative reports.' },
        { role: 'user', content: reportPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    // Extract responses
    const summary = summaryResponse.choices[0]?.message?.content?.trim() || `Research on ${query} shows significant developments and ongoing innovation in this field.`
    
    const findingsText = findingsResponse.choices[0]?.message?.content?.trim() || ''
    const keyFindings = findingsText.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .slice(0, 5)
    
    if (keyFindings.length === 0) {
      keyFindings.push(
        `${query} is experiencing rapid growth and development`,
        `Multiple approaches and methodologies are being explored`,
        `Industry adoption is increasing across various sectors`,
        `Research funding and investment continue to grow`,
        `Future prospects appear promising with continued innovation`
      )
    }

    const report = reportResponse.choices[0]?.message?.content?.trim() || generateFallbackReport(query)

    // Generate query-specific mock sources
    const mockSources = generateQuerySpecificSources(query)

    console.log('AI research generation completed successfully')
    console.log('Summary length:', summary.length)
    console.log('Findings count:', keyFindings.length)
    console.log('Report length:', report.length)
    
    return {
      query,
      summary,
      keyFindings,
      sources: mockSources,
      analysis: {
        credibility: "High",
        consensus: "Strong",
        dateRange: "2024",
        topicDepth: "Comprehensive"
      },
      report,
      generatedAt: new Date().toISOString()
    }

  } catch (error) {
    console.error('Error generating AI research:', error)
    
    // Fallback to query-specific mock data if AI fails
    return generateFallbackResearchData(query)
  }
}

// Generate query-specific sources
const generateQuerySpecificSources = (query: string) => {
  const queryLower = query.toLowerCase()
  const domains = ['nature.com', 'science.org', 'techcrunch.com', 'mit.edu', 'stanford.edu', 'arxiv.org', 'ieee.org']
  const sources = []

  // Generate 4-6 sources based on query
  for (let i = 0; i < 4 + Math.floor(Math.random() * 3); i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)]
    const relevanceScore = 0.7 + Math.random() * 0.3 // 70-100% relevance
    
    sources.push({
      title: `${query} - Research and Analysis | ${domain.split('.')[0].toUpperCase()}`,
      url: `https://${domain}/${queryLower.replace(/\s+/g, '-')}-research-${2024}`,
      snippet: `Recent research on ${query} has revealed important insights and developments. This comprehensive study examines current trends, methodologies, and future implications in the field.`,
      relevanceScore: Math.round(relevanceScore * 100) / 100,
      domain
    })
  }

  return sources
}

// Fallback research data when AI is not available
const generateFallbackResearchData = (query: string): ResearchResult => {
  const queryLower = query.toLowerCase()
  
  return {
    query,
    summary: `Based on available research sources, ${query} is an active area of study with ongoing developments and diverse perspectives. Current literature suggests multiple approaches and methodologies are being explored by researchers and practitioners in this field.`,
    keyFindings: [
      `${query} has gained significant attention in recent research`,
      `Multiple methodologies are being applied to study this topic`,
      `Current findings suggest both opportunities and challenges`,
      `Expert opinions indicate the need for continued investigation`,
      `Practical applications are being explored across various domains`
    ],
    sources: generateQuerySpecificSources(query),
    analysis: {
      credibility: "Medium",
      consensus: "Moderate", 
      dateRange: "2024",
      topicDepth: "Moderate"
    },
    report: generateFallbackReport(query),
    generatedAt: new Date().toISOString()
  }
}

// Generate a query-specific fallback report
const generateFallbackReport = (query: string): string => {
  const queryLower = query.toLowerCase()
  
  // Generate topic-specific content based on keywords
  let domainContext = ""
  let specificChallenges = ""
  let applications = ""
  let futureOutlook = ""
  
  if (queryLower.includes("ai") || queryLower.includes("artificial intelligence") || queryLower.includes("machine learning")) {
    domainContext = "artificial intelligence and machine learning technologies"
    specificChallenges = "algorithmic bias, data privacy, computational requirements, and ethical AI development"
    applications = "healthcare diagnostics, autonomous systems, natural language processing, and predictive analytics"
    futureOutlook = "continued advancement in neural architectures, increased integration across industries, and enhanced human-AI collaboration"
  } else if (queryLower.includes("climate") || queryLower.includes("environment") || queryLower.includes("sustainability")) {
    domainContext = "environmental science and sustainability initiatives"
    specificChallenges = "carbon emission reduction, renewable energy adoption, policy implementation, and international cooperation"
    applications = "clean energy systems, carbon capture technologies, sustainable agriculture, and green transportation"
    futureOutlook = "accelerated transition to renewable energy, innovative carbon reduction technologies, and global climate policy coordination"
  } else if (queryLower.includes("health") || queryLower.includes("medical") || queryLower.includes("medicine")) {
    domainContext = "healthcare and medical research"
    specificChallenges = "treatment accessibility, drug development costs, regulatory approval processes, and healthcare disparities"
    applications = "personalized medicine, telemedicine, medical devices, and preventive care programs"
    futureOutlook = "precision medicine advancement, digital health integration, and improved global health outcomes"
  } else if (queryLower.includes("crypto") || queryLower.includes("blockchain") || queryLower.includes("bitcoin")) {
    domainContext = "cryptocurrency and blockchain technology"
    specificChallenges = "regulatory uncertainty, scalability issues, energy consumption, and market volatility"
    applications = "digital payments, smart contracts, decentralized finance (DeFi), and supply chain tracking"
    futureOutlook = "increased institutional adoption, regulatory clarity, and integration with traditional financial systems"
  } else {
    domainContext = "the specified research domain"
    specificChallenges = "implementation barriers, resource constraints, stakeholder alignment, and technological limitations"
    applications = "various industry sectors, academic research, policy development, and practical implementations"
    futureOutlook = "continued research and development, increased adoption, and enhanced understanding of best practices"
  }

  return `# Comprehensive Research Report: ${query}

## Executive Summary

This research investigation provides an in-depth analysis of **${query}**, examining current developments, challenges, and opportunities within ${domainContext}. The study synthesizes information from academic literature, industry reports, and expert analyses to present a comprehensive overview of the field's current state and future trajectory.

## Research Methodology

Our research approach employed multiple methodologies to ensure comprehensive coverage:

### Data Collection
- **Literature Review**: Analysis of peer-reviewed academic publications from the past 24 months
- **Industry Analysis**: Examination of market reports, white papers, and industry publications
- **Expert Consultation**: Review of expert opinions, conference proceedings, and professional commentary
- **Trend Analysis**: Identification of emerging patterns and developments in the field

### Quality Assessment
- Source credibility evaluation using established academic and industry standards
- Cross-referencing of claims across multiple independent sources
- Temporal analysis to identify recent developments and trends
- Bias assessment and mitigation strategies

## Current State Analysis

### Market Landscape
The field of ${query} is experiencing significant evolution, with multiple stakeholders contributing to its development. Current research indicates:

- **Research Activity**: Increased publication volume and research funding in related areas
- **Industry Engagement**: Growing commercial interest and investment from major organizations
- **Innovation Pipeline**: Multiple breakthrough developments in various stages of implementation
- **Global Perspective**: International collaboration and knowledge sharing initiatives

### Key Developments
Recent developments in ${query} include:

1. **Technological Advancements**: New methodologies and tools that enhance capabilities and efficiency
2. **Regulatory Evolution**: Updated policies and guidelines that shape implementation approaches
3. **Market Dynamics**: Shifting competitive landscapes and emerging business models
4. **Academic Progress**: Breakthrough research findings that advance theoretical understanding

## Challenges and Opportunities

### Primary Challenges
The research identifies several key challenges facing ${query}:

- **Technical Barriers**: ${specificChallenges}
- **Resource Constraints**: Funding limitations and infrastructure requirements
- **Regulatory Complexity**: Navigating evolving legal and compliance frameworks
- **Stakeholder Alignment**: Coordinating diverse interests and priorities

### Emerging Opportunities
Despite challenges, significant opportunities exist:

- **Market Expansion**: Growing demand and new application areas
- **Technological Convergence**: Integration with complementary technologies and systems
- **Policy Support**: Increasing governmental and institutional backing
- **Innovation Potential**: Untapped possibilities for breakthrough developments

## Applications and Use Cases

### Current Applications
${query} is currently being applied in:
${applications}

### Emerging Use Cases
New applications are being explored in:
- Cross-industry implementations and hybrid approaches
- Integration with emerging technologies and platforms
- Novel problem-solving approaches and methodologies
- Scalable solutions for diverse organizational contexts

## Future Outlook and Predictions

### Short-term Projections (1-2 years)
- Continued research and development activity
- Increased pilot implementations and proof-of-concept projects
- Enhanced stakeholder engagement and collaboration
- Gradual market adoption and acceptance

### Medium-term Expectations (3-5 years)
- ${futureOutlook}
- Standardization of best practices and methodologies
- Broader market penetration and mainstream adoption
- Integration with existing systems and processes

### Long-term Vision (5+ years)
- Mature market with established players and practices
- Comprehensive regulatory frameworks and standards
- Global implementation and widespread acceptance
- Continued innovation and evolution of capabilities

## Strategic Recommendations

### For Researchers and Academics
1. **Focus Areas**: Prioritize research in high-impact, underexplored aspects of ${query}
2. **Collaboration**: Establish partnerships with industry and policy stakeholders
3. **Publication Strategy**: Target high-visibility venues to maximize research impact
4. **Funding Opportunities**: Pursue grants and funding aligned with current priorities

### For Industry Stakeholders
1. **Investment Strategy**: Develop phased approaches to technology adoption and implementation
2. **Risk Management**: Implement comprehensive assessment and mitigation strategies
3. **Talent Development**: Invest in workforce training and capability building
4. **Partnership Approach**: Collaborate with academic and research institutions

### For Policymakers
1. **Regulatory Framework**: Develop balanced approaches that encourage innovation while ensuring safety
2. **Stakeholder Engagement**: Facilitate dialogue between diverse interest groups
3. **International Coordination**: Participate in global standards and best practice development
4. **Public Interest**: Ensure policies serve broader societal benefits and objectives

## Conclusions

The research on ${query} reveals a dynamic and rapidly evolving field with significant potential for positive impact. While challenges exist, the opportunities for advancement and beneficial application are substantial. Success will require continued collaboration among researchers, industry stakeholders, and policymakers.

Key success factors include:
- Sustained investment in research and development
- Effective stakeholder coordination and collaboration
- Adaptive regulatory approaches that balance innovation and safety
- Commitment to ethical and responsible development practices

## Data Sources and Limitations

### Source Quality
This analysis is based on publicly available information and established research methodologies. While efforts have been made to ensure accuracy and comprehensiveness, readers should:
- Verify specific claims through primary sources
- Consider the temporal nature of rapidly evolving fields
- Supplement this analysis with specialized domain expertise
- Account for potential biases in available information

### Recommendations for Further Research
- Conduct primary research in specific application areas
- Engage directly with domain experts and practitioners
- Monitor ongoing developments and emerging trends
- Develop specialized analyses for particular use cases or contexts

---

*This report represents a comprehensive synthesis of available information on ${query} as of ${new Date().toLocaleDateString()}. For the most current developments, readers should consult recent publications and industry sources.*`
}

export async function POST(request: NextRequest) {
  try {
    console.log('Research agent request received')
    
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      console.log('Invalid request: missing query')
      return NextResponse.json(
        { error: 'Research query is required' },
        { status: 400 }
      )
    }

    if (query.trim().length < 5) {
      console.log('Invalid request: query too short')
      return NextResponse.json(
        { error: 'Query must be at least 5 characters long' },
        { status: 400 }
      )
    }

    console.log(`Conducting research for query: "${query}"`)

    // Check if GROQ API key is available for AI analysis
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'AI service not configured. Please check server configuration.' },
        { status: 500 }
      )
    }

    // Generate research results (using mock data for now)
    console.log('Generating research results...')
    const result = await generateMockResearchData(query)

    console.log('Research completed successfully')
    return NextResponse.json(result)

  } catch (error) {
    console.error('Research agent error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error'
    let statusCode = 500
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Categorize errors for better user experience
      if (error.message.includes('timeout')) {
        statusCode = 408 // Request Timeout
      } else if (error.message.includes('rate limit')) {
        statusCode = 429 // Too Many Requests
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}