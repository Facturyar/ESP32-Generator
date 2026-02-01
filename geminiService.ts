
import { GoogleGenAI } from "@google/genai";
import { ProjectConfig } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateProjectIdea(): Promise<string> {
  const prompt = "یک ایده پروژه خلاقانه و جذاب برای میکروکنترلر ESP32 پیشنهاد بده. ایده باید کوتاه و در حد یک عنوان باشد. فقط عنوان پروژه را برگردان.";
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating project idea:", error);
    throw new Error("Failed to generate project idea.");
  }
}


export async function generateProjectPlan(config: ProjectConfig): Promise<string> {

  const boardDescription = config.board === 'Custom' && config.customBoardConfig
    ? `- **نوع برد:** سفارشی (Custom)
  - **توضیحات برد سفارشی کاربر:** ${config.customBoardConfig}
  **دستورالعمل مهم برای برد سفارشی:** در هنگام تولید جدول اتصالات (Pinout) و شماتیک، حتماً به توضیحات برد سفارشی که توسط کاربر ارائه شده است توجه کامل کن و پین‌ها را بر اساس آن محدودیت‌ها و مشخصات انتخاب کن.`
    : `- **برد:** ${config.board}`;
    
  const customDescription = config.customDescription
    ? `- **توضیحات سفارشی کاربر:** ${config.customDescription}
  **دستورالعمل حیاتی برای توضیحات سفارشی:** این پروژه باید الزاماً توضیحات سفارشی کاربر را به عنوان یک نیاز اصلی در نظر بگیرد و تمام بخش‌ها، به‌خصوص کد و عملکرد، باید این نیاز را به طور کامل برآورده کنند.`
    : '';

  const prompt = `
  به عنوان یک مهندس الکترونیک و برنامه‌نویس سیستم‌های امبدد حرفه‌ای و ارشد، یک راهنمای کامل برای ساخت یک پروژه با ESP32 بر اساس مشخصات زیر ایجاد کن.
  خروجی باید کاملا به زبان فارسی باشد.

  **مشخصات پروژه:**
  ${boardDescription}
  - **هدف پروژه:** ${config.goal}
  - **ماژول‌ها و قطعات:** ${config.modules.join(', ')}
  - **پروتکل ارتباطی:** ${config.communication.join(', ')}
  - **زبان برنامه‌نویسی:** ${config.language}
  - **منبع تغذیه:** ${config.power}
  ${customDescription}

  **ساختار خروجی:**
  لطفاً پاسخ خود را دقیقاً با ساختار Markdown زیر و با همین سرفصل‌ها ارائه بده:

  ### 1. توضیح دقیق عملکرد پروژه
  (در این بخش، عملکرد کلی پروژه، هدف آن و نحوه تعامل قطعات با یکدیگر را به طور کامل و واضح توضیح بده.)

  ### 2. جدول اتصالات (Pinout)
  (یک جدول Markdown کامل برای اتصالات بین هر قطعه و پین‌های ESP32 ارائه بده. فرمت جدول: | قطعه | پین قطعه | پین ESP32 | توضیحات |. حتما از پین‌های امن و غیررزرو شده ESP32 استفاده کن و دلیل انتخاب پین‌ها را در صورت لزوم ذکر کن.)

  ### 3. شماتیک متنی مدار
  (یک شماتیک ساده مبتنی بر متن (ASCII) برای نمایش اتصالات مدار رسم کن.)

  ### 4. کد کامل پروژه
  (کد کامل و تمیز پروژه را به زبان ${config.language} بنویس. کد باید دارای کامنت‌های توضیحی فارسی برای هر بخش مهم باشد تا درک آن آسان شود. کد را در یک بلوک کد Markdown قرار بده.)

  ### 5. نکات مهم
  (لیستی از نکات کلیدی، خطاهای رایج، محدودیت‌های پین‌های ESP32 (مانند ADC2 و WiFi)، ملاحظات مربوط به تغذیه و راهکارهای عیب‌یابی برای این پروژه خاص را ارائه بده.)

  ### 6. پیشنهاد ارتقاء پروژه
  (دو یا سه ایده مشخص برای ارتقاء پروژه و افزودن ویژگی‌های جدید یا حرفه‌ای‌تر کردن آن پیشنهاد بده.)

  **دستورالعمل‌های حیاتی:**
  - کد باید بدون خطا، کامل و قابل کامپایل در محیط Arduino IDE (برای Arduino C++) باشد.
  - از پین‌های رزرو شده ESP32 (مانند GPIO 6-11) استفاده نکن.
  - پین‌اوت باید منطقی و بدون تداخل باشد.
  - کل پاسخ باید به زبان فارسی روان و فنی باشد.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}
