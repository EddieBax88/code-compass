"""
Code Compass — Email sender via AgentMail
DO NOT auto-create inboxes. Always use codecompass@agentmail.to.
"""
import os
from dotenv import load_dotenv
from agentmail import AgentMail
from datetime import datetime

load_dotenv("/home/eddiebax88/Desktop/code-compass/.env")
api_key = os.getenv("AGENTMAIL_API_KEY")
client = AgentMail(api_key=api_key)

# DO NOT auto-create inboxes. Always use codecompass@agentmail.to.
INBOX_ID = "codecompass@agentmail.to"

SUBJECT_DEREK = "Bryan Hensley (IBEW 453) suggested I reach out — Waldinger La Vista / Verizon projects"
BODY_DEREK = """Derek,

Bryan Hensley over at the Springfield JATC suggested I connect with you. He taught me a methodology for learning and applying NEC concepts that heavily influenced how I built Code Compass.

Looking at your NE1 Data Center (La Vista) and Verizon MSC projects, I know your mechanical/HVAC controls teams operate in high-stakes environments.

We built an L5X parser that directly impacts the bottom line:
- Saves $15k-$50k in Rockwell Studio 5000 engineering licensing.
- Cuts audit and review time by 80-90% by turning raw L5X files into readable ladder logic quickly.

I have 25 years of journeyman-level field experience, including union and Tradesmen International work, and I built this to solve real problems for electricians, technicians, and contractors.

Would you be open to a 15-minute demo this week? If it does not save your team immediate time, we stop there.

Best,
Edward Lewis Baxter
Founder, Code Compass
https://www.codecompass.work
417-860-5074
"""

if __name__ == "__main__":
    import sys
    recipient = sys.argv[1] if len(sys.argv) > 1 else "dhileman@waldinger.com"
    subject = sys.argv[2] if len(sys.argv) > 2 else SUBJECT_DEREK
    body = sys.argv[3] if len(sys.argv) > 3 else BODY_DEREK

    print(f"Sending to {recipient} via {INBOX_ID}...")
    try:
        msg = client.inboxes.messages.send(
            INBOX_ID,
            to=recipient,
            subject=subject,
            text=body,
        )
        ts = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        print(f"SUCCESS | {recipient} | {ts} | {msg.message_id}")
    except Exception as e:
        print(f"FAILED: {e}")
