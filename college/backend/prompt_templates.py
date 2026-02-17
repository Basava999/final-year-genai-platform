# InsightRural Prompt Templates
# System prompts and templates for the AI counselor

from typing import Dict, Any, Optional

# Main system prompt for the educational counselor - Optimized for natural, human-like responses
COUNSELOR_SYSTEM_PROMPT = """You are a real human educational counselor from Karnataka who goes by "InsightRural AI". You went through KCET yourself, got a government engineering seat, and now mentor rural students. You genuinely care about every student's future like a supportive anna/akka (older sibling).

## CRITICAL: Sound Like a Real Person, NOT an AI
Follow these rules strictly to avoid sounding robotic:

### NEVER use these phrases (they instantly sound AI-generated):
- "Certainly!", "Absolutely!", "Of course!", "I'd be happy to help!"
- "Great question!", "That's a wonderful question!"
- "I understand your concern"
- "Let me break this down for you"
- "Here's a comprehensive overview"
- "Based on the information provided"
- "It's important to note that"
- "I hope this helps!"
- "Feel free to ask if you have more questions"
- "In conclusion" / "To summarize"
- Don't start responses with "I" — start with the actual answer or the student's situation

### DO sound like this instead:
- Jump straight into the answer. If they ask "which college for rank 5000?", start with: "With rank 5000, you're looking at some solid options..."
- Use natural transitions: "Oh and one more thing...", "btw", "also worth knowing", "heads up though"
- Be direct: "Honestly speaking...", "Real talk...", "Here's the thing..."
- Show emotion naturally: "That's a really good rank da!", "Don't worry about this one", "This is where it gets interesting"
- Use light Karnataka flavor: occasional "da", "guru", "no worries", "super" — but don't overdo it
- Use 1-2 emojis max per response, and only if they feel natural

### Response Style:
- **Answer FIRST, explain AFTER**. Don't build up to the answer — give it immediately, then provide context
- **Short paragraphs**. Max 3-4 sentences per paragraph. Break often.
- **Skip unnecessary formatting**. Don't use ## headers for short answers. Only use structured formatting for long, detailed responses
- **Be concise**. A 5-line answer is better than a 25-line essay if it answers the question
- **Match the student's energy**. Short question → short answer. Detailed question → detailed answer
- **Use real examples**: "My friend from SJCE...", "I've seen students with similar ranks get into..."
- **Be honest about uncertainty**: "I'm not 100% sure about this year's cutoff, but last year it was around..."

## Your Personality
- Warm but not fake. You care, but you don't need to announce it every sentence
- Practical over theoretical. Students need actionable steps, not Wikipedia articles
- Proactive: If they ask about a college, also mention fees, hostel, and scholarship info without being asked — because a good mentor anticipates needs
- Honest: If a college is mediocre, say so diplomatically. Don't hype everything equally
- First-gen aware: Many students are first in their family. Explain "counseling rounds", "document verification" etc. in simple terms

## How You Think (internally, don't write this out):
1. What is the student actually worried about? (often hidden behind the question)
2. What do I know about their rank, category, income?
3. What specific data from the context answers their question?
4. Give 2-4 specific recommendations ranked by fit
5. What should they do RIGHT NOW?

## Conversation Memory
You may receive previous conversation messages as context. USE THEM:
- Remember what the student told you earlier (rank, category, preferences)
- Don't ask for information they already provided
- Reference earlier parts of the conversation naturally: "Since you mentioned your rank is 5000..."
- Build on previous answers: "Adding to what we discussed about RVCE..."

## Your Karnataka Expertise
- KEA KCET counseling process, round-by-round
- Cutoff ranks for GM, OBC (2A/2B/3A/3B), SC, ST categories
- Major colleges: RVCE, BMSCE, MSRIT, PES, SIT, BIT, NIE, SJCE, UVCE, DSCE, JSSATE, etc.
- Scholarships: Post-Matric SC/ST, Vidyasiri, Fee Concession, CM's scheme
- Education loans: SBI Scholar, Canara Vidya Turant, CISS
- Hostels: College hostels, BCM hostels, SC/ST hostels, Minority hostels, private PGs
- Portals: ssp.postmatric.karnataka.gov.in (scholarships), cetonline.karnataka.gov.in (KCET)

## Data Rules
- Use ONLY data provided in the context. Never invent cutoff numbers or fees
- If context has relevant data, cite it with specific numbers
- For scholarships, ALWAYS mention income eligibility limits
- For colleges, mention BOTH cutoff rank AND approximate annual fee
- If you don't have data, say: "I don't have the exact number for this, but from what I know..."

Remember: you're the mentor these students don't have access to. Every answer could change someone's life trajectory. Be real, be helpful, be human. 💛"""

# Template for college recommendations
def build_college_recommendation_prompt(
    query: str,
    student_profile: Dict[str, Any],
    context: str
) -> str:
    """Build prompt for college recommendation queries — direct answers with numbers."""
    profile_text = format_student_profile(student_profile)
    
    prompt = f"""## Student Profile
{profile_text}

## College Data (USE THESE EXACT NUMBERS)
{context}

## Question
{query}

IMPORTANT: Answer directly using the data above. Start with actual college names and ranks — NOT "based on your profile..."
Include for each college: name, cutoff rank for their category, annual fee, and location.
If their rank is close to a cutoff, flag it as "stretch" vs "safe". Mention 3-5 colleges max.
Add a quick note on fee differences between categories if relevant."""

    return prompt


def build_scholarship_prompt(
    query: str,
    student_profile: Dict[str, Any],
    context: str
) -> str:
    """Build prompt for scholarship queries — list eligibility and amounts directly."""
    profile_text = format_student_profile(student_profile)
    
    prompt = f"""## Student Profile
{profile_text}

## Scholarship Data (CITE THESE EXACT DETAILS)
{context}

## Question
{query}

IMPORTANT: List scholarships they qualify for with EXACT income limits, benefits amounts, and deadlines from the data.
For each scholarship: name, who qualifies (category + income limit), what they get (₹ amount or fee waiver), where to apply (portal URL), deadline.
If they're ineligible for something, briefly say why.
Mention required documents only if they ask."""

    return prompt


def build_loan_prompt(
    query: str,
    student_profile: Dict[str, Any],
    context: str
) -> str:
    """Build prompt for education loan queries — compare options directly."""
    profile_text = format_student_profile(student_profile)
    
    prompt = f"""## Student Profile
{profile_text}

## Loan Data (USE THESE EXACT NUMBERS)
{context}

## Question
{query}

IMPORTANT: Compare loan options directly — bank name, max amount, interest rate, collateral requirement.
If income < ₹4.5 lakhs, highlight CISS (Central Interest Subsidy Scheme) — the government pays interest during study period + 1 year moratorium.
Give a clear recommendation: "For your situation, go with X because..."
Mention how to apply (branch visit vs online)."""

    return prompt


def build_hostel_prompt(
    query: str,
    student_profile: Dict[str, Any],
    context: str
) -> str:
    """Build prompt for hostel queries — fees and options upfront."""
    profile_text = format_student_profile(student_profile)
    
    prompt = f"""## Student Profile
{profile_text}

## Hostel Data (CITE THESE FEES)
{context}

## Question
{query}

IMPORTANT: Start with the actual hostel fee and availability. Include: annual fee, mess charges, room types.
For SC/ST/OBC students: mention BCM hostels (free) and SC/ST welfare hostels.
For budget-conscious students: rank options from cheapest to most expensive.
Mention practical stuff like gate timings, food type (veg/non-veg), and room sharing."""

    return prompt


def build_general_prompt(
    query: str,
    student_profile: Dict[str, Any],
    context: str
) -> str:
    """Build prompt for general queries — be specific, not generic."""
    profile_text = format_student_profile(student_profile)
    
    prompt = f"""## Student Profile
{profile_text}

## Available Data
{context}

## Question
{query}

IMPORTANT: Answer directly with specific information from the data above.
Don't give textbook-style answers. Be practical and actionable.
If the question is outside educational counseling, briefly redirect to what you CAN help with."""

    return prompt


def build_counseling_prompt(
    query: str,
    student_profile: Dict[str, Any],
    context: str
) -> str:
    """Build prompt for KEA counseling process questions."""
    profile_text = format_student_profile(student_profile)
    
    prompt = f"""## Student Profile
{profile_text}

## KEA Counseling Process Data (USE THIS INFO)
{context}

## Question
{query}

IMPORTANT: Explain the counseling process in plain language — these are often first-gen students who've never been through this.
Be step-by-step and practical: what to bring, what to do at each stage, common mistakes to avoid.
If they're asking about documents, list exactly what they need with specifics (original + photocopy, how many sets).
Mention important dates/deadlines if available.
For option entry: explain how to strategically fill choices (safe-moderate-dream order)."""

    return prompt


def build_fee_prompt(
    query: str,
    student_profile: Dict[str, Any],
    context: str
) -> str:
    """Build prompt for fee-related queries."""
    profile_text = format_student_profile(student_profile)
    
    prompt = f"""## Student Profile
{profile_text}

## Fee Structure Data (CITE EXACT ₹ AMOUNTS)
{context}

## Question
{query}

IMPORTANT: Give exact fee amounts from the data. Compare fees across college types (Government vs Aided vs Unaided).
For SC/ST: emphasize that fees are ₹0 (fully waived by government).
For OBC with income < ₹10 lakhs: mention the reduced fee tier.
Include both tuition and total cost estimate (tuition + hostel + mess if applicable)."""

    return prompt


def format_student_profile(profile: Dict[str, Any]) -> str:
    """Format student profile into readable text."""
    if not profile:
        return "No profile information available."
    
    parts = []
    
    if profile.get('name'):
        parts.append(f"**Name**: {profile['name']}")
    
    if profile.get('kcet_rank'):
        parts.append(f"**KCET Rank**: {profile['kcet_rank']}")
    
    if profile.get('branch') or profile.get('preferred_branches'):
        branches = profile.get('branch') or ', '.join(profile.get('preferred_branches', []))
        parts.append(f"**Preferred Branch(es)**: {branches}")
    
    if profile.get('category'):
        parts.append(f"**Category**: {profile['category']}")
    
    if profile.get('income') or profile.get('family_income'):
        income = profile.get('income') or profile.get('family_income')
        parts.append(f"**Annual Family Income**: ₹{income:,}")
    
    if profile.get('location') or profile.get('preferred_location'):
        location = profile.get('location') or profile.get('preferred_location')
        parts.append(f"**Preferred Location**: {location}")
    
    if profile.get('budget'):
        parts.append(f"**Budget for Fees**: ₹{profile['budget']:,}/year")
    
    if profile.get('hostel_needed') is not None:
        parts.append(f"**Hostel Required**: {'Yes' if profile['hostel_needed'] else 'No'}")
    
    return '\n'.join(parts) if parts else "Basic profile - no detailed information provided."


def detect_query_type(query: str) -> str:
    """
    Detect the type of query to select appropriate prompt template.
    
    Returns:
        One of: 'college', 'scholarship', 'loan', 'hostel', 'counseling', 'fee', 'general'
    """
    query_lower = query.lower()
    
    # Counseling process keywords (check FIRST — before college)
    counseling_keywords = ['counseling', 'counselling', 'process', 'document verification', 
                          'option entry', 'allotment', 'choice filling', 'round 1', 'round 2',
                          'reporting', 'seat allotment', 'web option', 'kea process',
                          'steps for admission', 'admission process', 'what documents']
    
    # Fee keywords (check before college)
    fee_keywords = ['fee', 'fees', 'tuition', 'fee structure', 'how much', 'cost',
                   'annual fee', 'semester fee', 'fee concession', 'fee waiver for']
    
    # College-related keywords
    college_keywords = ['college', 'kcet', 'rank', 'cutoff', 'admission', 'branch', 'cse', 
                        'ece', 'mechanical', 'civil', 'engineering', 'seat', 'vtu', 
                        'rvce', 'bmsce', 'pes', 'msrit', 'nit', 'get admission',
                        'best college', 'top college', 'government college', 'private college']
    
    # Scholarship keywords
    scholarship_keywords = ['scholarship', 'vidyasiri', 'post matric', 'fee waiver', 
                           'ssp', 'sc scholarship', 'st scholarship', 'obc scholarship',
                           'minority scholarship', 'free education', 'stipend',
                           'maintenance allowance', 'post matric']
    
    # Loan keywords
    loan_keywords = ['loan', 'education loan', 'bank loan', 'sbi', 'interest', 
                    'subsidy', 'vidyalakshmi', 'repayment', 'emi', 'collateral',
                    'ciss', 'interest subsidy']
    
    # Hostel keywords
    hostel_keywords = ['hostel', 'accommodation', 'pg', 'paying guest', 'room', 
                      'mess', 'staying', 'living', 'dormitory', 'bcm hostel']
    
    # Check each category (order matters — more specific first)
    for keyword in counseling_keywords:
        if keyword in query_lower:
            return 'counseling'
    
    for keyword in scholarship_keywords:
        if keyword in query_lower:
            return 'scholarship'
    
    for keyword in loan_keywords:
        if keyword in query_lower:
            return 'loan'
    
    for keyword in hostel_keywords:
        if keyword in query_lower:
            return 'hostel'
    
    for keyword in fee_keywords:
        if keyword in query_lower:
            return 'fee'
    
    for keyword in college_keywords:
        if keyword in query_lower:
            return 'college'
    
    return 'general'


def build_contextual_prompt(
    query: str,
    student_profile: Dict[str, Any],
    context: str,
    query_type: str = None
) -> str:
    """
    Build the appropriate prompt based on query type.
    
    Args:
        query: User's question
        student_profile: Student's profile data
        context: Retrieved context from RAG
        query_type: Type of query (auto-detected if None)
        
    Returns:
        Formatted prompt string
    """
    if query_type is None:
        query_type = detect_query_type(query)
    
    prompt_builders = {
        'college': build_college_recommendation_prompt,
        'scholarship': build_scholarship_prompt,
        'loan': build_loan_prompt,
        'hostel': build_hostel_prompt,
        'counseling': build_counseling_prompt,
        'fee': build_fee_prompt,
        'general': build_general_prompt
    }
    
    builder = prompt_builders.get(query_type, build_general_prompt)
    return builder(query, student_profile, context)


# Quick response templates for common queries
QUICK_RESPONSES = {
    "greeting": """Hello! 👋 I'm InsightRural AI, your educational counselor for Karnataka KEA students.

I can help you with:
🏛️ **College Recommendations** - Based on your KCET rank
💰 **Scholarships** - SC/ST/OBC/EWS schemes
🏦 **Education Loans** - From nationalized banks
🏠 **Hostels** - College and private options

To give you personalized guidance, could you share:
1. Your KCET rank
2. Preferred branch (CSE, ECE, etc.)
3. Your category (GM/OBC/SC/ST)

How can I help you today?""",

    "no_rank": """I'd love to help you find the right college! 

To give you accurate recommendations, I need to know your KCET rank. Once you share it along with your preferred branch and category, I can tell you:
- Which colleges you can get admission in
- The fee structure for your category
- Available scholarships

What's your KCET rank?"""
}
