import React from 'react';
import { Shield,  Activity, CreditCard, Phone, 
         ShoppingCart, FileText, TrendingUp, Lock, UserX, BanknoteIcon } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      title: "Financial Fraud",
      icon: <CreditCard className="service-icon" />,
     
      situations: "Unauthorized withdrawals, suspicious account transactions, altered financial statements",
      chatbotHelp: "Enter details about suspicious transactions or financial statements for analysis and guidance on potential fraudulent activity"
    },
    {
      title: "Insurance Fraud",
      icon: <Shield className="service-icon" />,
     
      situations: "False claims, exaggerated damages, staged accidents",
      chatbotHelp: "Provide claim details, and the chatbot will highlight signs of fraudulent claims"
    },
    {
      title: "Healthcare Fraud",
      icon: <Activity className="service-icon" />,
     
      situations: "Billing for services not rendered, duplicate claims, falsified diagnoses",
      chatbotHelp: "Describe received healthcare services to flag potential overcharges or fraud"
    },
    {
      title: "Telecommunications Fraud",
      icon: <Phone className="service-icon" />,
    
      situations: "Unauthorized charges, excessive usage, fraudulently opened accounts",
      chatbotHelp: "Ask about recent phone charges for guidance on irregularities or unauthorized usage"
    },
    {
      title: "Digital/E-commerce Fraud",
      icon: <ShoppingCart className="service-icon" />,  // Use ShoppingCart here
     
      situations: "Stolen credit card use, account takeover, fraudulent purchases",
      chatbotHelp: "Input recent online transaction details to identify potential fraudulent purchases"
    },
    {
      title: "Tax Fraud",
      icon: <FileText className="service-icon" />,
     
      situations: "False income declarations, unreported earnings, falsified deductions",
      chatbotHelp: "Provide tax return information to check for discrepancies indicating possible fraud"
    },
    {
      title: "Investment Fraud",
      icon: <TrendingUp className="service-icon" />,
     
      situations: "Ponzi schemes, insider trading, fraudulent investment offers",
      chatbotHelp: "Share investment details for risk assessment and signs of potential fraud"
    },
    {
      title: "Cyber/Digital Fraud",
      icon: <Lock className="service-icon" />,
     
      situations: "Phishing attacks, data breaches, malware infections",
      chatbotHelp: "Describe suspicious digital activity for guidance on potential security risks"
    },
    {
      title: "Identity Theft",
      icon: <UserX className="service-icon" />,
    
      situations: "Unauthorized account openings, credit misuse",
      chatbotHelp: "Report unauthorized accounts or transactions for recovery advice and next steps"
    },
    {
      title: "Money Laundering",
      icon: <BanknoteIcon className="service-icon" />,
      situations: "Large, unexplained transfers, structured transactions to avoid detection",
      chatbotHelp: "Input suspicious transactions to investigate patterns that may suggest money laundering"
    }
  ];

  return (
    <div className="services-page">
      <div className="header-section">
       
        <h1>Our Fraud Detection Services</h1>
        <p className="header-description">
          Advanced AI-powered solutions to protect against various types of fraud
        </p>
      </div>

    

      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-header">
              {service.icon}
              <h2>{service.title}</h2>
            </div>
            
            <div className="service-content">
              <div className="info-section">
                <h3>Detection Methods</h3>
                <p>{service.methods}</p>
              </div>
              
              <div className="info-section">
                <h3>Possible Fraud Situations</h3>
                <p>{service.situations}</p>
              </div>
              
              <div className="info-section">
                <h3>Chatbot Assistance</h3>
                <p>{service.chatbotHelp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .services-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #f8fafc;
        }

        .image-section {
          text-align: center;
          margin-bottom: 20px;
        }

        .header-image {
          width: 100%;
          height: 30pc;
          max-height: 400px;
          object-fit: inherit;
          border-radius: 16px;
        }

        .header-section {
          text-align: center;
          margin-bottom: 60px;
          padding: 40px 0;
          background: #AAB6FB;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .header-icon {
          width: 48px;
          height: 48px;
          color: #2563eb;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 2.5rem;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .header-description {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          padding: 20px 0;
        }

        .service-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
        }

        .service-header {
          padding: 24px;
          background: linear-gradient(80deg, #00188f, #EC008C);
          color: white;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .service-icon {
          width: 28px;
          height: 28px;
          color: white;
        }

        h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .service-content {
          padding: 24px;
        }

        .info-section {
          margin-bottom: 20px;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        h3 {
          font-size: 1.1rem;
          color: #334155;
          margin: 0 0 8px 0;
          font-weight: 600;
        }

        p {
          margin: 0;
          color: #64748b;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 2rem;
          }

          .header-section {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;
