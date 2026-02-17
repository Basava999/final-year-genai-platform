# InsightRural LLM Service
# This module handles integration with Groq Cloud API for LLM inference

import json
import os
from typing import Generator, Dict, Any, Optional, List

# Try to import Groq
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    print("Warning: Groq not installed. Run: pip install groq")

# Groq API configuration - read at runtime, not import time
# Using 70B model for ChatGPT-like contextual understanding
DEFAULT_MODEL = "llama-3.3-70b-versatile"


class GroqService:
    """
    Service for interacting with Groq Cloud LLM API.
    Supports both streaming and non-streaming responses.
    Uses Llama 3.3 70B model by default.
    """
    
    def __init__(self, api_key: str = None, model: str = None):
        """
        Initialize the Groq service.
        
        Args:
            api_key: Groq API key (or set GROQ_API_KEY env var)
            model: Model name to use (e.g., 'llama-3.3-70b-versatile')
        """
        # Always read API key fresh from environment
        self.api_key = api_key or os.environ.get("GROQ_API_KEY", "")
        self.model = model or os.environ.get("GROQ_MODEL", DEFAULT_MODEL)
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self) -> bool:
        """Initialize the Groq client."""
        if not GROQ_AVAILABLE:
            print("Warning: Groq package not installed")
            return False
        
        if not self.api_key:
            print("Warning: GROQ_API_KEY not set. Get one free at https://console.groq.com/keys")
            return False
        
        try:
            self.client = Groq(api_key=self.api_key)
            print(f"[OK] Groq client initialized with model: {self.model}")
            return True
        except Exception as e:
            print(f"Warning: Failed to initialize Groq client: {e}")
            return False
    
    def _check_connection(self) -> bool:
        """Check if Groq API is accessible."""
        if not self.client:
            return False
        try:
            # Try a simple API call to verify connection
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=5
            )
            return True
        except Exception as e:
            print(f"Warning: Groq connection check failed: {e}")
            return False
    
    def generate(self, prompt: str, system_prompt: str = None, 
                 temperature: float = 0.7, max_tokens: int = 2048,
                 chat_history: list = None) -> str:
        """
        Generate a response from the LLM (non-streaming).
        
        Args:
            prompt: User's prompt/question
            system_prompt: System instructions for the model
            temperature: Creativity (0.0-1.0)
            max_tokens: Maximum response length
            chat_history: Previous conversation messages [{"role": "user"/"assistant", "content": "..."}]
            
        Returns:
            Generated response text
        """
        if not self.client:
            return self._get_smart_fallback(prompt)
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        # Inject conversation history for memory/context
        if chat_history:
            for msg in chat_history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if role in ("user", "assistant") and content:
                    messages.append({"role": role, "content": content})
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._get_smart_fallback(prompt)
    
    def generate_stream(self, prompt: str, system_prompt: str = None,
                        temperature: float = 0.7, chat_history: list = None) -> Generator[str, None, None]:
        """
        Generate a streaming response from the LLM.
        
        Args:
            prompt: User's prompt/question
            system_prompt: System instructions
            temperature: Creativity level
            chat_history: Previous conversation messages
            
        Yields:
            Response text chunks
        """
        if not self.client:
            yield self._get_smart_fallback(prompt)
            return
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        # Inject conversation history for memory
        if chat_history:
            for msg in chat_history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if role in ("user", "assistant") and content:
                    messages.append({"role": role, "content": content})
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                stream=True
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            print(f"Groq streaming error: {e}")
            yield self._get_smart_fallback(prompt)
    
    def chat(self, messages: List[Dict[str, str]], 
             temperature: float = 0.7) -> str:
        """
        Chat completion with message history.
        
        Args:
            messages: List of {"role": "user"|"assistant"|"system", "content": "..."}
            temperature: Creativity level
            
        Returns:
            Assistant's response
        """
        if not self.client:
            user_msg = next((m['content'] for m in reversed(messages) if m['role'] == 'user'), '')
            return self._get_fallback_response(user_msg)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Groq chat error: {e}")
            user_msg = next((m['content'] for m in reversed(messages) if m['role'] == 'user'), '')
            return self._get_fallback_response(user_msg)
    
    def _get_fallback_response(self, query: str) -> str:
        """
        Provide a fallback response when Groq is not available.
        This uses simple keyword-based responses.
        """
        query_lower = query.lower()
        
        if 'college' in query_lower or 'kcet' in query_lower or 'rank' in query_lower:
            return """I apologize, but I'm currently running in offline mode without AI capabilities.

**For college recommendations based on your KCET rank:**
- Use our College Explorer feature to see cutoff data
- Top colleges like RVCE, BMSCE have cutoffs around 500-3000 for CSE
- Government colleges have cutoffs around 10,000-20,000

To enable full AI responses, please ensure GROQ_API_KEY is set:
1. Get a free API key from https://console.groq.com/keys
2. Set environment variable: GROQ_API_KEY=your-key
3. Restart the application"""
        
        elif 'scholarship' in query_lower:
            return """I'm currently in offline mode.

**Key Karnataka Scholarships:**
- **SC/ST students**: Post-Matric Scholarship (income < 2.5 lakhs) - Full fee reimbursement
- **OBC students**: Category 1-3 scholarships available
- **All categories**: AICTE Pragati for girls, Central Sector Scheme

Apply at: ssp.postmatric.karnataka.gov.in

To get personalized scholarship recommendations, please set your GROQ_API_KEY."""
        
        elif 'loan' in query_lower or 'fee' in query_lower:
            return """I'm currently in offline mode.

**Education Loan Options:**
- **SBI Student Loan**: Up to ₹15 lakhs, 8.5% interest
- **Central Subsidy**: Full interest waiver for family income < 4.5 lakhs
- **No collateral** required up to ₹7.5 lakhs

Apply through Vidyalakshmi portal: www.vidyalakshmi.co.in

For detailed guidance, please ensure GROQ_API_KEY is set."""
        
        elif 'hostel' in query_lower:
            return """I'm in offline mode.

**Hostel Options:**
- **College hostels**: ₹40,000-80,000/year + mess
- **Government hostels**: ₹8,000-15,000/year (subsidized)
- **SC/ST free hostels**: Apply through Social Welfare department
- **PGs in Bangalore**: ₹6,000-15,000/month

Contact your college admission office for hostel availability."""
        
        else:
            return """Hello! I'm InsightRural AI, your educational guidance assistant for Karnataka KEA students.

I'm currently running in **offline mode**. To enable full AI capabilities:
1. Get a free API key from https://console.groq.com/keys
2. Set environment variable: GROQ_API_KEY=your-key-here
3. Restart the application

Meanwhile, you can still:
- Browse college data using our explorer
- View scholarship information
- Check education loan options

How can I help you today?"""

    def _get_smart_fallback(self, query: str) -> str:
        """
        Provide smart fallback responses using RAG data when LLM is unavailable.
        This parses the query and returns relevant data from JSON files.
        """
        import re
        query_lower = query.lower()
        
        # Try to extract rank from query
        rank_match = re.search(r'rank\s*(?:is|:)?\s*(\d+)', query_lower)
        rank = int(rank_match.group(1)) if rank_match else None
        
        # Detect category
        category = "GM"
        if "obc" in query_lower:
            category = "OBC"
        elif "sc" in query_lower and "st" not in query_lower:
            category = "SC"
        elif "st" in query_lower:
            category = "ST"
        elif "general" in query_lower:
            category = "GM"
        
        # Detect branch
        branch = "CSE"
        if "ece" in query_lower or "electronics" in query_lower:
            branch = "ECE"
        elif "mechanical" in query_lower or "mech" in query_lower:
            branch = "ME"
        elif "civil" in query_lower:
            branch = "CE"
        elif "electrical" in query_lower or "eee" in query_lower:
            branch = "EEE"
        
        # College query with rank
        if rank and ('college' in query_lower or 'get' in query_lower):
            try:
                import json
                import os
                data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
                college_file = os.path.join(data_dir, 'kea_colleges_complete.json')
                
                with open(college_file, 'r', encoding='utf-8') as f:
                    colleges = json.load(f)
                
                eligible = []
                for college in colleges:
                    cutoffs = college.get('cutoff_2024', {})
                    branch_cutoff = cutoffs.get(branch, {})
                    if isinstance(branch_cutoff, dict):
                        cat_cutoff = branch_cutoff.get(category, branch_cutoff.get('GM', float('inf')))
                        if rank <= cat_cutoff:
                            eligible.append({
                                "name": college['name'],
                                "cutoff": cat_cutoff,
                                "fee": college.get('annual_fee', {}).get('gm', 'N/A'),
                                "location": college['location']
                            })
                
                eligible.sort(key=lambda x: x['cutoff'])
                
                if eligible:
                    response = f"""Based on your **KCET Rank {rank}** for **{branch}** ({category} category), here are colleges you can get:

"""
                    for i, c in enumerate(eligible[:8], 1):
                        response += f"**{i}. {c['name']}** ({c['location']})\n"
                        response += f"   - Cutoff: {c['cutoff']} | Fee: ₹{c['fee']}/year\n\n"
                    
                    response += f"\n*Total {len(eligible)} colleges found where you're eligible!*"
                    return response
                else:
                    return f"""For rank {rank} in {branch} ({category}), no exact matches found in our database.

**Suggestions:**
- Consider other branches where cutoffs may be higher
- Look at government colleges in tier-2 cities
- Apply to more colleges during counseling

Would you like me to check for other branches?"""
                    
            except Exception as e:
                pass
        
        # Scholarship query
        if 'scholarship' in query_lower:
            try:
                import json
                import os
                data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
                sch_file = os.path.join(data_dir, 'scholarships.json')
                
                with open(sch_file, 'r', encoding='utf-8') as f:
                    scholarships = json.load(f)
                
                response = f"""**Scholarships available for {category} students:**

"""
                count = 0
                for sch in scholarships:
                    elig_cats = [c.lower() for c in sch.get('eligibility', {}).get('category', [])]
                    if category.lower() in elig_cats or 'all' in elig_cats:
                        benefits = sch.get('benefits', {})
                        response += f"**{sch['name']}**\n"
                        response += f"   - Income limit: ₹{sch.get('eligibility', {}).get('income_limit', 'N/A')}\n"
                        response += f"   - Portal: {sch.get('application_portal', 'N/A')}\n\n"
                        count += 1
                        if count >= 5:
                            break
                
                return response if count > 0 else self._get_fallback_response(query)
                
            except Exception:
                pass
        
        # Default to basic fallback
        return self._get_fallback_response(query)


# Backwards compatibility alias
OllamaService = GroqService


# Create singleton instance
_llm_service = None

def get_llm_service() -> GroqService:
    """Get or create the LLM service singleton."""
    global _llm_service
    if _llm_service is None:
        _llm_service = GroqService()
    # Re-initialize if client is None but API key is now available
    elif _llm_service.client is None:
        api_key = os.environ.get("GROQ_API_KEY", "")
        if api_key:
            print("[*] Re-initializing LLM service with new API key...")
            _llm_service = GroqService()
    return _llm_service


if __name__ == "__main__":
    # Test the LLM service
    print("Testing Groq LLM Service...")
    print(f"GROQ_API_KEY set: {'Yes' if os.environ.get('GROQ_API_KEY') else 'No'}")
    
    service = GroqService()
    
    if service.client:
        print("\nSending test message...")
        response = service.generate(
            "What is 2 + 2? Reply in one word.",
            system_prompt="You are a helpful assistant. Give very short answers."
        )
        print(f"Response: {response}")
    else:
        print("\nNo API key set. Testing fallback...")
        response = service.generate("Tell me about college options for rank 5000")
        print(f"Fallback Response: {response[:200]}...")
