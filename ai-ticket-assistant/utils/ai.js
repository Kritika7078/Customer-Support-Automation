// import { createAgent, gemini } from "@inngest/agent-kit";

// const analyzeTicket = async (ticket) => {

//   const allowedSkills = [
//         "Troubleshooting", "API Debugging", "Hardware Diagnosis", "System Administration", 
//         "Network Configuration", "Cloud Services (e.g., AWS/Azure)", "Security Operations", 
//         "Software Development (Specific Language)", "Database Management", "Incident Management", 
//         "System Monitoring", "Root Cause Analysis", "Payment Processing", "Invoicing", 
//         "Accounting Software", "Compliance (e.g., PCI)", "Product Knowledge", 
//         "CRM Management", "Needs Assessment", "Proposal Writing", "Logistics Management", 
//         "Refund Processing", "Inventory Tracking", "HR Policy Knowledge", "Legal Compliance", 
//         "Confidentiality", "Customer Service", "Technical Writing", "Documentation", 
//         "Content Knowledge"
//     ];
//     
//     // Create a string representation of the skills for the prompt
//     const skillsListString = allowedSkills.map(s => `"${s}"`).join(", ");

//     const systemPrompt = `You are an expert AI assistant that processes technical support tickets. 

// Your job is to:
// 1. Summarize the issue.
// 2. Estimate its priority.
// 3. Provide helpful notes and resource links for human moderators.
// 4. List relevant technical skills required.

// **CRITICAL CONSTRAINT: The 'relatedSkills' array MUST ONLY contain skills from the following predefined list. If a ticket requires a skill not on this list, select the closest general skill (e.g., use "Troubleshooting" instead of "specific_brand_fix"): [${skillsListString}].**

// IMPORTANT:
// - Respond with *only* valid raw JSON.
// - Do NOT include markdown, code fences, comments, or any extra formatting.
// - The format must be a raw JSON object.

// Repeat: Do not wrap your output in markdown or code fences.`;

//     const supportAgent = createAgent({
//         model: gemini({
//             model: "gemini-2.5-pro",
//             apiKey: process.env.GEMINI_API_KEY,
//         }),
//         name: "AI Ticket Triage Assistant",
//         system: systemPrompt,
//     });

//     const response =
//         await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
//         
// Analyze the following support ticket and provide a JSON object with:

// - summary: A short 1-2 sentence summary of the issue.
// - priority: One of "low", "medium", or "high".
// - helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
// - relatedSkills: An array of relevant skills required to solve the issue. **CRITICAL: The skills must be chosen exclusively from the predefined list of allowed skills.**

// Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

// {
// "summary": "Short summary of the ticket",
// "priority": "high",
// "helpfulNotes": "Here are useful tips...",
// "relatedSkills": ["Troubleshooting", "System Administration"] // e.g., only from the allowed list
// }

// ---

// Ticket information:

// - Title: ${ticket.title}
// - Description: ${ticket.description}`);
// //   const supportAgent = createAgent({
// //     model: gemini({
// //       model: "gemini-2.5-pro",
// //       apiKey: process.env.GEMINI_API_KEY,
// //     }),
// //     name: "AI Ticket Triage Assistant",
// //     system: `You are an expert AI assistant that processes technical support tickets. 

// // Your job is to:
// // 1. Summarize the issue.
// // 2. Estimate its priority.
// // 3. Provide helpful notes and resource links for human moderators.
// // 4. List relevant technical skills required.

// // IMPORTANT:
// // - Respond with *only* valid raw JSON.
// // - Do NOT include markdown, code fences, comments, or any extra formatting.
// // - The format must be a raw JSON object.

// // Repeat: Do not wrap your output in markdown or code fences.`,
// //   });

// //   const response =
// //     await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
// // Analyze the following support ticket and provide a JSON object with:

// // - summary: A short 1-2 sentence summary of the issue.
// // - priority: One of "low", "medium", or "high".
// // - helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
// // - relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

// // Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

// // {
// // "summary": "Short summary of the ticket",
// // "priority": "high",
// // "helpfulNotes": "Here are useful tips...",
// // "relatedSkills": ["React", "Node.js"]
// // }

// // ---

// // Ticket information:

// // - Title: ${ticket.title}
// // - Description: ${ticket.description}`);

//   // Support several possible response shapes from the agent and guard
//   // against undefined before calling string methods like `match`.
//   let raw =
//     (response && response.output && response.output[0] && response.output[0].context) ||
//     response?.outputText ||
//     response?.text ||
//     (typeof response === "string" ? response : null);

//   if (typeof raw === "object") {
//     try {
//       raw = JSON.stringify(raw);
//     } catch (e) {
//       raw = String(raw);
//     }
//   }

//   if (!raw) {
//     console.log("AI response is empty or in an unexpected shape:", response);
//     return null;
//   }

//   // try {
//   //   const fenceMatch = raw.match(/```json\s*([\s\S]*?)\s*```/i);
//   //   const jsonString = fenceMatch ? fenceMatch[1] : raw.trim();
//   //   return JSON.parse(jsonString);
//   // } catch (e) {
//   //   console.log("Failed to parse JSON from AI response:", e && e.message ? e.message : e);
//   //   console.log("Full AI response:", raw);
//   //   return null;
//   // }

//   // --- REPLACE the entire block below this line ---
// let rawText = response?.outputText || response?.text || null;

// // Fallback: Check the 'output' array for the content, which is common
// // in AgentResult wrappers like the one you are using.
// if (!rawText && response?.output?.length > 0 && response.output[0]?.content) {
//     rawText = response.output[0].content;
// }

// if (!rawText) {
//     console.error("AI response is empty or in an unexpected shape:", response);
//     return null;
// }

// try {
//     // Attempt 1: Check for markdown JSON fences (```json ... ```)
//     // This regex safely extracts the content between the fences.
//     const fenceMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/i);
    
//     let jsonString;

//     if (fenceMatch && fenceMatch[1]) {
//         console.log("Successfully extracted JSON from markdown fence.");
//         jsonString = fenceMatch[1].trim();
//     } else {
//         // Attempt 2: If no fence, assume it's raw JSON
//         jsonString = rawText.trim();
//     }
    
//     return JSON.parse(jsonString);
      
//     } catch (e) {
//       console.log("Final JSON parsing failed:", e.message);
//       console.log("Full AI response (problematic):", rawJsonString);
//       return null;
//     }
// //   }
// };


// export default analyzeTicket;


import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {

  const allowedSkills = [
        "Troubleshooting", "API Debugging", "Hardware Diagnosis", "System Administration", 
        "Network Configuration", "Cloud Services (e.g., AWS/Azure)", "Security Operations", 
        "Software Development (Specific Language)", "Database Management", "Incident Management", 
        "System Monitoring", "Root Cause Analysis", "Payment Processing", "Invoicing", 
        "Accounting Software", "Compliance (e.g., PCI)", "Product Knowledge", 
        "CRM Management", "Needs Assessment", "Proposal Writing", "Logistics Management", 
        "Refund Processing", "Inventory Tracking", "HR Policy Knowledge", "Legal Compliance", 
        "Confidentiality", "Customer Service", "Technical Writing", "Documentation", 
        "Content Knowledge"
    ];
    
    const skillsListString = allowedSkills.map(s => `"${s}"`).join(", ");

    const systemPrompt = `You are an expert AI assistant that processes technical support tickets. 

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

**CRITICAL CONSTRAINT: The 'relatedSkills' array MUST ONLY contain skills from the following predefined list. If a ticket requires a skill not on this list, select the closest general skill (e.g., use "Troubleshooting" instead of "specific_brand_fix"): [${skillsListString}].**

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.

Repeat: Do not wrap your output in markdown or code fences.`;

    const supportAgent = createAgent({
        model: gemini({
            model: "gemini-2.5-pro",
            apiKey: process.env.GEMINI_API_KEY,
        }),
        name: "AI Ticket Triage Assistant",
        system: systemPrompt,
    });

    const response =
        await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue. **CRITICAL: The skills must be chosen exclusively from the predefined list of allowed skills.**

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
"summary": "Short summary of the ticket",
"priority": "high",
"helpfulNotes": "Here are useful tips...",
"relatedSkills": ["Troubleshooting", "System Administration"] // e.g., only from the allowed list
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);


// --- START OF FIXED EXTRACTION AND PARSING LOGIC ---

let rawText = response?.outputText || response?.text || null;

// Fallback: Check the 'output' array for the content
if (!rawText && response?.output?.length > 0 && response.output[0]?.content) {
    rawText = response.output[0].content;
}

if (!rawText) {
    console.error("AI response is empty or in an unexpected shape:", response);
    return null;
}

try {
    // Attempt 1: Check for markdown JSON fences (```json ... ```)
    const fenceMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/i);
    
    let jsonString;

    if (fenceMatch && fenceMatch[1]) {
        console.log("Successfully extracted JSON from markdown fence.");
        jsonString = fenceMatch[1].trim();
    } else {
        // Attempt 2: If no fence, assume it's raw JSON
        jsonString = rawText.trim();
    }
    
    return JSON.parse(jsonString);
    
} catch (e) {
    console.error("Final JSON parsing failed:", e.message);
    // Corrected variable name: rawText
    console.error("Full AI response (problematic):", rawText);
    return null;
}
};

export default analyzeTicket;