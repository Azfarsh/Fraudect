const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express(); // Define the Express app instance here
const PORT = process.env.PORT || 3001;

// MSSQL Database Configuration using environment variables
const mssqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true,
        driver: 'ODBC Driver 17 for SQL Server'
    }
};

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate chat response
async function generateChatResponse(userInput, conversationHistory) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
        You are an AI Fraud Detection Assistant. Your role is to:
        -when user provides his fraud message or situation ask him his country to provide country based government fraud complaining webiste and number
        - Analyze potential fraud patterns
        - Provide security recommendations
        - Help users understand financial fraud
        - Be precise and security-focused
        -provide user website or phone number based on his fraudlent situation on asking what he should do or when he provides his fraudlent situation
        -Fraud Response Chatbot Instructions
        1. Autocorrection Instructions (30-50 instructions)

         Correcting Misspellings in User Input
         Interpreting Common Phrasing Errors
         Handling Grammar Issues
Disambiguating Fraud Types
Guidance on Specific Keywords
Expanding Abbreviations
Normalizing Date Formats
Identifying Financial Terminology

2. Fraud Situations and How to Handle Them (100-120 instructions)
General Fraud Instructions

Asking for Country
API Key Retrieval
Summarizing Case
Gathering Details

Specific Fraud Situations

Credit Card Fraud
Phishing Scam
Online Shopping Scam
Investment Fraud
Identity Theft
Impersonation Fraud
Bank Transfer Fraud
Lottery and Prize Scams

Step-by-Step Fraud Handling Advice

Encourage Documentation
Guide on Reporting
Support for Stolen Information
Provide Checklists

3. Calming Instructions and Simple Responses (50-70 instructions)

Provide Reassurance
Emphasize Calm Action
Encourage Patience with Investigation
Reassure Security of Information
Keep Explanations Simple
Reassurance Against Further Threats
Validate User's Actions
Offer Emotional Support

Country-Specific Resources and Summarization

Dynamic Country-Based Links
Automatic Summarization
Instruction Example for Summarization

API Implementation Notes

Required Environment Variables
Error Handling
Rate Limiting

Response Format Guidelines

Structure of Responses
Formatting Guidelines
Closing the Response

User Follow-up Protocol

Generate unique case reference number
Save conversation context
Provide clear return instructions
Set expectations for next steps
Offer additional resource links

Safety and Privacy Guidelines

Do Not Ask For

Regulatory Compliance

Include relevant disclaimers
Maintain data privacy standards
Follow regional reporting requirements
Update resources regularly
Fraud Reporting Resources by Country
United States

Federal Trade Commission (FTC)

Website: https://www.ftc.gov/complaint
Phone: 1-877-FTC-HELP (1-877-382-4357)


FBI Internet Crime Complaint Center (IC3)

Website: https://www.ic3.gov


Identity Theft Resource Center

Website: https://www.idtheftcenter.org
Phone: 1-888-400-5530



United Kingdom

Action Fraud

Website: https://www.actionfraud.police.uk
Phone: 0300 123 2040


Financial Conduct Authority

Website: https://www.fca.org.uk/consumers/report-scam



Canada

Canadian Anti-Fraud Centre

Website: https://www.antifraudcentre-centreantifraude.ca
Phone: 1-888-495-8501


RCMP Cybercrime

Website: https://www.rcmp-grc.gc.ca/cycp-cpvp



Australia

ScamWatch

Website: https://www.scamwatch.gov.au


Australian Competition and Consumer Commission (ACCC)

Website: https://www.accc.gov.au/report



India

Cybercrime Portal, Ministry of Home Affairs

Website: https://cybercrime.gov.in
Phone: 1930



Germany

Federal Office for Information Security (BSI)

Website: https://www.bsi.bund.de/EN/Service-Navi/Report/report_node.html


Polizei - German Police

Website: https://www.polizei-beratung.de/opferinformationen/cybercrime/



France

French Anti-Fraud Office (FIDP)

Website: https://www.economie.gouv.fr/dgccrf/signaler-une-fraude


National Cybercrime Centre (C3N)

Website: https://www.interieur.gouv.fr/Le-ministere/DGPN/Direction-centrale-de-la-police-judiciaire/C3N



Spain

National Police (Policía Nacional)

Website: https://www.policia.es/denuncias.php


Civil Guard (Guardia Civil)

Website: https://www.guardiacivil.es/es/servicios/denuncias/index.html



Japan

National Consumer Affairs Center of Japan

Website: https://www.kokusen.go.jp/soudan_list/


Cybercrime Control Office, National Police Agency

Phone: #9110
        Previous conversation:
        ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
        
        User: ${userInput}
        
        Provide a helpful, security-focused response:`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating response:', error);
        throw new Error('Failed to generate response');
    }
}

// Chat endpoint
app.post('/chatbot', async (req, res) => {
    const { message, conversationHistory } = req.body;
    
    try {
        console.log('Received chat request:', { message, conversationHistory });
        const response = await generateChatResponse(message, conversationHistory || []);
        console.log('Generated response:', response);
        
        res.json({ message: response, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: error.message, timestamp: new Date().toISOString() });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Connect to MSSQL Database
sql.connect(mssqlConfig).then(pool => {
    console.log('Connected to MSSQL Database');
    app.set('db', pool);
}).catch(err => {
    console.error('Database connection error:', err);
});

// Registration Route
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, securityQuestion, securityAnswer } = req.body;
    if (!firstName || !lastName || !email || !password || !securityQuestion || !securityAnswer) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const pool = req.app.get('db');
    try {
        await pool.request()
            .input('first_name', sql.NVarChar(255), firstName)
            .input('last_name', sql.NVarChar(255), lastName)
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), password)
            .input('security_question', sql.NVarChar(255), securityQuestion)
            .input('security_answer', sql.NVarChar(255), securityAnswer)
            .query(`
                INSERT INTO registerdetail (first_name, last_name, email, password, security_question, security_answer)
                VALUES (@first_name, @last_name, @email, @password, @security_question, @security_answer)
            `);
        await pool.request()
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), password)
            .input('login_method', sql.NVarChar(50), 'Email')
            .query(`
                INSERT INTO UserLogin (email, password, login_method)
                VALUES (@email, @password, @login_method)
            `);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const pool = req.app.get('db');
    try {
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), password)
            .query(`
                SELECT * FROM registerdetail WHERE email = @email AND password = @password
            `);

        if (result.recordset.length > 0) {
            await pool.request()
                .input('email', sql.NVarChar(255), email)
                .input('login_method', sql.NVarChar(50), 'Email')
                .query(`
                    INSERT INTO UserLogin (email, login_method)
                    VALUES (@email, @login_method)
                `);
            res.json({ message: 'Login successful', user: result.recordset[0] });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Profile Route
app.get('/profile', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const pool = req.app.get('db');
    try {
        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT p.*, l.email, l.login_timestamp 
                FROM UserProfiles p
                JOIN UserLogin l ON p.user_id = l.user_id
                WHERE p.user_id = @user_id
            `);
        if (result.recordset.length > 0) {
            res.json({ profile: result.recordset[0] });
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Could not fetch profile. Please try again.' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Handle server errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
