import React, { useEffect, useRef, useState } from "react";
import "../styles/Home.css";
import passportImg from "../assets/Lebanese-passport.jpg";
import { Link } from "react-router-dom";
import { FiShield, FiUserCheck, FiCpu } from "react-icons/fi";
import { MdOutlineAppRegistration } from "react-icons/md";


export default function Home({ session, lang }) {

  const text = {
    en: {
      title: "Jawazak — Lebanon’s Digital Passport Platform",
      subtitle: "Fast, secure, and designed to modernize your passport experience.",
      description:
        "Jawazak unifies the entire passport process in one smart, citizen-focused system, offering simple applications, secure identity verification, and seamless document handling.",
      
      cards: [
        { title: "Passport Services", body: "Apply for, renew, and manage your Lebanese passport digitally." },
        { title: "Appointment Booking", body: "Book appointments at the General Security offices quickly and easily." },
        { title: "Application Tracking", body: "Check the status of your passport or civil registry applications." },
        { title: "Passport Fees & Requirements", body: "Learn about required documents, fees, and processing times." },
      ],

      aboutTitle: "About Jawazak",
      aboutBody:
        "Jawazak is a unified Lebanese digital platform designed to simplify passport services. It provides secure access, fast processing, and clear guidance every step of the way.",
      aboutPoints: [
        "Secure Digital Protection",
        "Fast and Easy Identity Verification",
        "Simple Electronic Processing",
      ],

      assistantTitle: "Smart Assistant",
      assistantBody:
        "Get quick support using our Smart Assistant designed to help citizens navigate their passport procedures easily.",
      assistantPoints: [
        "24/7 Automated Support",
        "Step-by-step Instructions",
        "Simple and Fast Navigation",
      ],

      stepsTitle: "How to Apply",
      step1: "Create an account using your personal information",
      step2: "Upload required documents & verify your identity",
      step3: "Pay online and submit your application",
    },

    ar: {
      title: "جوازك — المنصّة الرقمية لجوازات السفر في لبنان",
      subtitle: "ذكي وآمن وسلس — جواز سفرك يبدأ من هنا",
      description:
        "يوفّر جوازك تجربة حديثة ومبسّطة لإصدار وتجديد جوازات السفر عبر نظام موحّد يسهّل تقديم الطلبات، يسرّع التحقق، ويضمن معالجة شفافة لجميع المواطنين.",

      cards: [
        { title: "خدمات جواز السفر", body: "قدّم طلب جواز سفر جديد أو جدّد الجواز رقمياً." },
        { title: "حجز المواعيد", body: "احجز مواعيدك في مراكز الأمن العام بسرعة وسهولة." },
        { title: "متابعة الطلب", body: "تتبّع حالة طلب جواز السفر أو معاملات السجل المدني." },
        { title: "الرسوم والمتطلبات", body: "تعرّف إلى المستندات المطلوبة والرسوم وأوقات الإنجاز." },
      ],

      aboutTitle: "عن جوازك",
      aboutBody:
        "جوازك هو منصة لبنانية موحّدة تهدف إلى تبسيط خدمات الجوازات عبر عملية رقمية آمنة وسريعة وسهلة الاستخدام.",
      aboutPoints: [
        "حماية رقمية آمنة",
        "تحقق سريع وسهل من الهوية",
        "خطوات إلكترونية مبسّطة",
      ],

      assistantTitle: "المساعد الذكي",
      assistantBody:
        "احصل على دعم فوري عبر المساعد الذكي المصمّم لمساعدة المواطنين في تنقّلهم ضمن خدمات الجوازات بسهولة.",
      assistantPoints: [
        "دعم تلقائي على مدار الساعة",
        "إرشادات خطوة بخطوة",
        "تنقّل بسيط وسريع",
      ],

      stepsTitle: "كيفية التقديم",
      step1: "إنشاء حساب باستخدام معلوماتك الشخصية",
      step2: "رفع المستندات المطلوبة والتحقق من الهوية",
      step3: "الدفع الإلكتروني وتقديم الطلب",
    },
  };

  const cards = text[lang].cards;

  /* ========= INFINITE 3-CARD CAROUSEL ========= */

  const VISIBLE = 3;
  const trackRef = useRef(null);

  const extendedCards = [
    ...cards.slice(cards.length - VISIBLE),
    ...cards,
    ...cards.slice(0, VISIBLE),
  ];

  const [index, setIndex] = useState(VISIBLE);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    const auto = setInterval(() => setIndex((i) => i + 1), 3500);
    return () => clearInterval(auto);
  }, [lang]);

  useEffect(() => {
    if (index === extendedCards.length - VISIBLE) {
      setTimeout(() => {
        setTransition(false);
        setIndex(VISIBLE);
      }, 450);
    }

    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(cards.length);
      }, 450);
    }

    const t = setTimeout(() => setTransition(true), 480);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div className={`home-container ${lang === "ar" ? "rtl" : ""}`}>

      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${passportImg})` }}
      >
        <div className="hero-overlay">
          <h1>{text[lang].title}</h1>
          <h3>{text[lang].subtitle}</h3>
          <p>{text[lang].description}</p>

        <Link
        to={session ? "/portal" : "/sign-in"}
        className="hero-apply-btn"
      >
        {lang === "en" ? "Apply Now" : "قدّم الآن"}
         <MdOutlineAppRegistration  size={24} />
      </Link>


        </div>
      </section>

     

      {/* ABOUT SECTION */}
      <section id="about" className="about-section">
        <h2 className="section-title">{text[lang].aboutTitle}</h2>
        <p className="section-desc">{text[lang].aboutBody}</p>

        <div className="about-cards">
  <div className="about-card">
    <FiShield size={32} color="#1a3d7c" />
    <p>{text[lang].aboutPoints[0]}</p>
  </div>

  <div className="about-card">
    <FiUserCheck size={32} color="#1a3d7c" />
    <p>{text[lang].aboutPoints[1]}</p>
  </div>

  <div className="about-card">
    <FiCpu size={32} color="#1a3d7c" />
    <p>{text[lang].aboutPoints[2]}</p>
  </div>
</div>

      </section>

      {/* SMART ASSISTANT */}
      <section className="assistant-section">
        <h2 className="section-title">{text[lang].assistantTitle}</h2>
        <p className="section-desc">{text[lang].assistantBody}</p>

        <ul className="assistant-list">
          {text[lang].assistantPoints.map((p, idx) => (
            <li key={idx}>✓ {p}</li>
          ))}
        </ul>
      </section>

      {/* HOW TO APPLY */}
      <section id="apply" className="steps-section">
        <h2 className="section-title">{text[lang].stepsTitle}</h2>

        <div className="steps-container">
          <div className="step-box">
            <span className="step-number">1</span>
            <p>{text[lang].step1}</p>
          </div>

          <div className="step-box">
            <span className="step-number">2</span>
            <p>{text[lang].step2}</p>
          </div>

          <div className="step-box">
            <span className="step-number">3</span>
            <p>{text[lang].step3}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
