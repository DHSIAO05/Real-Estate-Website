const fs = require("fs");
const createAssistant = async (openai) => {
  // Assistant file path
  const assistantFilePath = "assistant.json";
  // check if file exists
  if (!fs.existsSync(assistantFilePath)) {
    // Create a file
    const file = await openai.files.create({
      file: fs.createReadStream("Real_Estate_Knowledge_Base.docx"),
      purpose: "assistants",
    });
    // Create a vector store including our file
    let vectorStore = await openai.beta.vectorStores.create({
      name: "Chat Demo",
      file_ids: [file.id],
    });
    // Create assistant
    const assistant = await openai.beta.assistants.create({
      name: "Chat Demo",
      instructions: `Knowledge Base for Real Estate Website
Website Overview
Welcome to Jennifer Liu Homes, a comprehensive real estate platform providing users with the most up-to-date information about the housing market, recent sales, and personalized services. Below are common topics and features that users may want to explore, along with example questions to assist them.
1. Homepage
Overview:
The homepage features Jennifer Liu Homes branding and navigation to major sections of the site such as Recent Sales, Monthly News, and Contact.
Example Questions:
- "What services are offered by Jennifer Liu Homes?"
- "How can I get in touch with Jennifer Liu?"
- "Can I view recent sales data?"
2. Recent Sales Section
Overview:
The Recent Sales section provides details of homes recently sold, including property addresses, prices, square footage, and additional information.
Example Questions:
- "Can I see the most recent property sales in San Jose?"
- "What was the selling price of 1638 Stanwich Rd, San Jose?"
- "Are there any homes sold recently in Elk Grove?"
3. Monthly News Section
Overview:
The Monthly News section keeps users updated with the latest real estate market trends, reports, and insights. Articles may include housing market updates, mortgage trends, and more. This section is updated regularly to reflect the latest information.
Example Questions:
- "What is the latest Bay Area housing market update?"
- "Can I access the monthly news report for May 2023?"
- "What are the recent trends in the real estate market?"
4. Contact Section
Overview:
This section allows users to contact Jennifer Liu directly via a form submission. Users can fill out their name, email, phone, and leave a message. This information will be sent directly to Jennifer Liu's email for follow-up.
Example Questions:
- "How can I contact Jennifer Liu for a consultation?"
- "Can I schedule a property viewing with Jennifer Liu?"
- "What is Jennifer Liu's contact email?"
5. Property Listings
Overview:
Each listing provides detailed information about a property, including the number of bedrooms, bathrooms, square footage, and lot size.
Example Questions:
- "How many bedrooms does the house on Kooser Rd have?"
- "What is the square footage of the home on Lick Ave?"
- "Can I view more details on a specific home sale?"
6. Working with Jennifer Liu
Overview:
Users can opt to work with Jennifer Liu through a call-to-action button ('Work with Jennifer Liu') on the homepage. The button leads to a contact form where users can send inquiries.
Example Questions:
- "How can I work with Jennifer Liu on selling my property?"
- "Can Jennifer Liu assist in buying a home?"
- "What services does Jennifer Liu provide for new home buyers?"
7. Social Media and External Links
Overview:
The website includes links to Jennifer Liu's social media profiles on WeChat, Line, and Instagram. Users can scan QR codes to add Jennifer Liu on WeChat and Line, allowing them to stay connected with updates, property listings, and market trends.
Example Questions:
- "Can I follow Jennifer Liu on Instagram?"
- "Where can I scan the QR code to add Jennifer Liu on WeChat?"
- "How do I add Jennifer Liu on Line?"

WeChat and Line QR Codes:
- WeChat: Users can scan a QR code to add Jennifer Liu on WeChat.
- Line: Users can scan a QR code to add Jennifer Liu on Line.
Common Troubleshooting Questions:
Q: Why can't I submit the contact form?
A: Please ensure all required fields are filled in. Double-check that your email is correctly entered. If the issue persists, try refreshing the page.
Q: How do I view more recent sales information?
A: Visit the Recent Sales section of the site where we list all recent property sales. You can click on any of the sales for additional details.
Q: How can I schedule a meeting with Jennifer Liu?
A: Use the contact form to submit your request. Jennifer Liu will reach out to you based on your provided contact information.
Additional Information:
Services Provided by Jennifer Liu Homes:
- Property buying assistance
- Property selling assistance
- Real estate market analysis
- Personalized real estate consultation

Operating Locations:
- San Jose, CA
- Elk Grove, CA
- Other surrounding areas in the Bay Area and Sacramento

Contact Information:
- Email: jenniferliu5588@gmail.com
- Phone: 408-438-2280
- Social Media: 
  - WeChat: Add Jennifer via QR Code
  - Line: Add Jennifer via QR Code
  - Instagram: [Instagram Link](#)
`,
      tools: [{ type: "file_search" }],
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
      model: "gpt-4o",
    });
    // Write assistant to file
    fs.writeFileSync(assistantFilePath, JSON.stringify(assistant));
    return assistant;
  } else {
    // Read assistant from file
    const assistant = JSON.parse(fs.readFileSync(assistantFilePath));
    return assistant;
  }
};
module.exports = { createAssistant };
