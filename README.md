# LaunchLens AI Startup Validator

🎥 **[Watch the Demo Video on YouTube](https://youtu.be/bvAJYhezvZI)**

**LaunchLens** is an advanced venture intelligence platform tailored for VCs, angel investors, and analysts. It leverages a multi-model AI pipeline (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro) to dissect, validate, and aggressively "roast" startup pitches.

## 🚀 Features
- **Multi-Model Intelligence**: Compare outputs from industry-leading LLMs.
- **Dynamic Roasting**: Choose your brutality tier (Mild, Spicy, Brutal) for unfiltered AI feedback.
- **Competitor Mapping**: Instantly visualize market gaps and existing threats.
- **Sleek Minimalist UI**: Glassmorphic dark mode design utilizing Framer Motion and Tailwind CSS.

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **AI Integrations**: Groq SDK, Google Gemini SDK
- **State Management**: Zustand
- **Backend/DB**: Firebase

## ⚙️ Setup & Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Snigdha-0210/StartUp_Validator.git
   cd StartUp_Validator
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Environment Variables
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
   ```
   *(Note: API keys must be kept private and are automatically ignored by git)*

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
