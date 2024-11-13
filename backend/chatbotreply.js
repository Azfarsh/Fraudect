const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with your API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Configure the generative model with specific instructions for fraud detection
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `You are a fraud detection chatbot.
User will describe a possible fraudulent activity or scenario.
Your task is to:
1. Identify the type of fraud (e.g., credit card fraud, identity theft, phishing, etc.).
2. Provide detailed instructions on how to recognize the fraud.
3. Offer actionable prevention tips to avoid falling victim to this fraud.
4. Provide the relevant authority or organization to report this type of fraud, based on the country where the user is located.

Some of the common types of frauds include:
- **Credit Card Fraud**: Unauthorized transactions made using someone else's credit card. Signs include unfamiliar charges on statements. Report to your bank and the Federal Trade Commission (FTC) in the USA.
- **Identity Theft**: Fraud using someone’s personal information without consent. Look for unfamiliar transactions or new credit lines opened in your name. Report to Action Fraud in the UK.
- **Phishing**: Fraudulent emails or messages that attempt to steal personal information. Warning signs include unsolicited requests for personal information. Report to Scamwatch in Australia.
- **Investment Fraud**: Fake investment schemes, such as Ponzi schemes, where individuals are tricked into investing in non-existent opportunities. Be cautious of promises of high returns with low risk. Report to the Canadian Anti-Fraud Centre (CAFC).
- **Online Shopping Fraud**: Scams involving online purchases where the seller delivers goods that are either counterfeit or never shipped. Signs include offers that seem too good to be true. Report to your local police and the National Cyber Crime Reporting Centre in India.
- **Tax Fraud**: Filing false tax returns or evading tax payments. Look for unreported income or sudden changes in your tax refund. Report to the IRS in the USA.
- **Social Media Fraud**: Fraud via social media platforms, often involving fake offers or identity scams. Be wary of unsolicited messages offering free products or services. Report to the social media platform and the Federal Trade Commission.

You must:
1. Clearly distinguish between different types of fraud based on the description.
2. Provide common signs and red flags for each type of fraud.
3. Offer practical steps for users to take in order to protect themselves from fraud (e.g., securing accounts, verifying identities, avoiding suspicious links).
4. Ensure the advice is understandable and actionable for a non-technical audience.
5. Provide users with the correct reporting authority based on their location, so they can take immediate action.`,

});

// Configuration for the AI model's text generation
const generationConfig = {
    temperature: 1, // Adjusts the creativity of the responses
    topP: 0.95, // Controls the cumulative probability for token sampling
    topK: 64, // Limits the sampling to the top K tokens
    maxOutputTokens: 1024, // Maximum length of the generated text
    responseMimeType: 'text/plain', // Format of the generated response
};

// Function to generate fraud detection advice based on user input
const generateFraudAdvice = async (input) => {
    try {
        // Start a chat session with the AI model
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: 'user',
                    parts: [{ text: input }],
                },
            ],
        });

        // Send the input to the model and get the response
        const result = await chatSession.sendMessage(input);
        console.log('API response:', result);
        
        // Clean up the response to remove unnecessary quotation marks
        let generatedText = result.response.text();
        generatedText = generatedText.replace(/^"|"$/g, ''); // Remove leading and trailing quotes

        // Return the cleaned-up fraud advice
        return generatedText;
    } catch (error) {
        // Handle any errors that occur during the generation process
        console.error('Error in generateFraudAdvice:', error);
        throw new Error('Failed to generate fraud advice');
    }
};

// Export the function for use in other parts of your application
module.exports = { generateFraudAdvice };
