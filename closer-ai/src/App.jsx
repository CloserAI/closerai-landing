import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Clock, AlertTriangle, Coins, CheckCircle, 
  XCircle, Zap, Brain, FileText, Shield, Check, Star,
  ChevronRight, Lock, Mail, MapPin, Sparkles, TrendingUp,
  ArrowRight, PlayCircle, MousePointer2, ShieldCheck,
  BrainCircuit, FileOutput, Plus, Server, Scale, Fingerprint,
  ArrowLeft, FileCheck, Loader2
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionTemplate, 
  useMotionValue,
  AnimatePresence,
  useInView
} from 'framer-motion';

// ==============================================
// 🎨 DESIGN SYSTEM CONSTANTS & UTILS
// ==============================================

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ==============================================
// ⚙️ CONFIGURATION EMAILJS
// ==============================================
// Remplace ces valeurs par celles de ton tableau de bord EmailJS :
const SERVICE_ID = "service_546d5z8";   // Ex: "service_x9s8..."
const TEMPLATE_ID = "template_urdu0q5"; // Ex: "template_8d7..."
const PUBLIC_KEY = "o4vPeDYAPGrizUxdL";   // Ex: "user_Kjs8..."

// Smooth Scroll Utility
const scrollToSectionId = (sectionId, e) => {
  if (e) e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

// ==============================================
// 🧩 SHARED UI COMPONENTS (Existing)
// ==============================================

function SpotlightCard({ children, className = "", spotlightColor = "rgba(99, 102, 241, 0.2)", noHover = false }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative border border-white/[0.08] bg-[#0B101B]/80 backdrop-blur-sm overflow-hidden rounded-[2rem]",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_20px_-12px_rgba(0,0,0,0.5)]",
        className
      )}
      whileHover={noHover ? {} : { y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none mix-blend-overlay" />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)
          `,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      <div className="relative z-20 h-full">{children}</div>
    </motion.div>
  );
}

const PrimaryButton = ({ children, href, icon: Icon }) => {
  const isInternalLink = href && href.startsWith('#');
  return (
  <motion.a
    href={href}
      target={isInternalLink ? undefined : "_blank"}
      rel={isInternalLink ? undefined : "noopener noreferrer"}
      onClick={isInternalLink ? (e) => {
        const sectionId = href.replace('#', '');
        scrollToSectionId(sectionId, e);
      } : undefined}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
      className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl overflow-hidden shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-white to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-background-shine" />
      <span className="relative flex items-center gap-2 z-10 text-sm uppercase tracking-wide">
        {children} {Icon && <Icon size={16} className="text-indigo-600" />}
      </span>
  </motion.a>
);
};

const SectionTitle = ({ title, subtitle, align = "center", eyebrow }) => {
  return (
    <div className={cn("mb-24 relative z-10", align === "center" ? "text-center mx-auto" : "text-left")}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
        }}
      >
        {eyebrow && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-500/50"></span>
            <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">
              {eyebrow}
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-500/50"></span>
          </div>
        )}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
          {title}
        </h2>
        <div className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          {subtitle}
        </div>
      </motion.div>
    </div>
  );
};

const AnimatedCounter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { stiffness: 50, damping: 20, duration: 3000 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 20 }
  }
};

// ==============================================
// 📄 LEGAL COMPONENTS (NEW)
// ==============================================

const LegalSection = ({ title, icon: Icon, children }) => (
  <motion.div variants={itemVariants} className="mb-10">
    <div className="flex items-center gap-3 mb-4 group">
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/50 transition-colors">
        <Icon size={16} />
      </div>
      <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
    </div>
    <div className="pl-11 text-slate-400 leading-relaxed space-y-2 text-sm md:text-base">
      {children}
    </div>
  </motion.div>
);

const LegalSeparator = () => (
  <motion.div 
    variants={itemVariants}
    className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" 
  />
);

const MentionsLegales = ({ onBack }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <section className="min-h-screen pt-32 pb-20 relative overflow-hidden">
       {/* Background Ambiance */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-indigo-900/10 opacity-20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        {/* Navigation */}
        <div className="max-w-3xl mx-auto mb-12">
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors mb-8"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-indigo-500/10 transition-all group-hover:-translate-x-1">
              <ArrowLeft size={16} />
            </div>
            Retour à l'accueil
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Mentions Légales</h1>
            <p className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
              Dernière mise à jour : 19/11/2025
            </p>
          </motion.div>
          </div>

        {/* Content Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <SpotlightCard className="p-8 md:p-12 !bg-[#0B101B]/90" noHover={true}>
            
            {/* 1. Éditeur */}
            <LegalSection title="Éditeur" icon={Sparkles}>
              <p><strong className="text-white">Dénomination :</strong> CloserAI</p>
              <p><strong className="text-white">SIRET :</strong> 92424436100011</p>
              <p>
                <strong className="text-white">Contact :</strong>{' '}
                <a href="mailto:contactcloserai@gmail.com" className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors decoration-indigo-400/30 underline-offset-4">
                  contactcloserai@gmail.com
                </a>
              </p>
            </LegalSection>

            <LegalSeparator />

            {/* 2. Hébergement */}
            <LegalSection title="Hébergement" icon={Server}>
              <p><strong className="text-white">Hébergeur :</strong> Netlify Inc.</p>
              <p>2325 3rd Street, Suite 215, San Francisco, California 94107, États-Unis.</p>
            </LegalSection>

            <LegalSeparator />

            {/* 3. Propriété Intellectuelle */}
            <LegalSection title="Propriété Intellectuelle" icon={Brain}>
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les contenus présents (textes, images, graphismes, logo, icônes, sons, logiciels) sont la propriété exclusive de <strong className="text-white">CloserAI</strong>.
              </p>
              <p className="mt-2">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
              </p>
            </LegalSection>

            <LegalSeparator />

            {/* 4. Données Personnelles (RGPD) */}
            <LegalSection title="Données Personnelles (RGPD)" icon={ShieldCheck}>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-indigo-400 shrink-0 mt-1">●</span>
                  <div>
                    <strong className="text-white block text-sm mb-1">Collecte</strong>
                    Votre adresse email est collectée uniquement à des fins de relations commerciales et de gestion de votre compte utilisateur.
          </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400 shrink-0 mt-1">●</span>
                  <div>
                    <strong className="text-white block text-sm mb-1">Utilisation</strong>
                    Aucune donnée n'est vendue à des tiers. Les données sont utilisées pour le support client et l'amélioration de nos services d'IA.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400 shrink-0 mt-1">●</span>
                  <div>
                    <strong className="text-white block text-sm mb-1">Vos Droits</strong>
                    Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, de suppression, d’opposition et de portabilité de vos données.
                    <br />Pour exercer ce droit : <a href="mailto:contactcloserai@gmail.com" className="text-indigo-400 hover:text-white transition-colors">contactcloserai@gmail.com</a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400 shrink-0 mt-1">●</span>
                  <div>
                     En cas de litige, vous disposez du droit d'introduire une réclamation auprès de la <strong className="text-white">CNIL</strong>.
                  </div>
                </li>
              </ul>
            </LegalSection>

            <LegalSeparator />

            {/* 5. Cookies */}
            <LegalSection title="Cookies" icon={Fingerprint}>
              <p>
                Ce site utilise uniquement des cookies techniques strictement nécessaires au bon fonctionnement de la plateforme (session, authentification).
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <CheckCircle size={12} /> Exempté de consentement
        </div>
            </LegalSection>

            <LegalSeparator />

            {/* 6. Droit Applicable */}
            <LegalSection title="Droit Applicable" icon={Scale}>
              <p>
                Tout litige en relation avec l’utilisation du site est soumis au <strong className="text-white">droit français</strong>. 
                Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
              </p>
            </LegalSection>

          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
};

const CGV = ({ onBack }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <section className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Ambiance */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-indigo-900/10 opacity-20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        {/* Navigation & Header */}
        <div className="max-w-3xl mx-auto mb-12">
              <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors mb-8"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-indigo-500/10 transition-all group-hover:-translate-x-1">
              <ArrowLeft size={16} />
            </div>
            Retour à l'accueil
              </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              Conditions Générales de Vente<br/>et d'Utilisation (CGV/CGU)
            </h1>
            <p className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
              Dernière mise à jour : 19/11/2025
            </p>
          </motion.div>
        </div>

        {/* Content Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <SpotlightCard className="p-8 md:p-12 !bg-[#0B101B]/90" noHover={true}>
            
            {/* Preamble */}
            <motion.div variants={itemVariants} className="mb-10 text-slate-400 italic text-sm border-l-2 border-indigo-500/30 pl-4">
              Les présentes Conditions Générales de Vente et d'Utilisation (ci-après "CGV/CGU") régissent l'utilisation du service CloserAI proposé par CloserAI. En accédant et en utilisant notre service, vous acceptez sans réserve les présentes conditions.
            </motion.div>

            <LegalSeparator />

            {/* Article 1 */}
            <LegalSection title="Article 1 : Objet" icon={Zap}>
              <p>
                Le service <strong className="text-white">CloserAI</strong> est un outil SaaS (Software as a Service) d'aide à la rédaction de mémoires techniques via l'Intelligence Artificielle. Il permet aux entreprises de générer automatiquement des réponses personnalisées aux appels d'offres publics en s'appuyant sur leurs anciens dossiers et leur expertise métier.
              </p>
              <p className="mt-2">
                Le service comprend notamment la configuration d'un modèle d'IA dédié au Client, l'ingestion de documents techniques antérieurs, et la génération de mémoires techniques formatés prêts à l'emploi.
              </p>
            </LegalSection>

            <LegalSeparator />

            {/* Article 2 */}
            <LegalSection title="Article 2 : Prix et Paiement" icon={Coins}>
              <p className="mb-4">Les tarifs des services proposés par CloserAI sont indiqués en euros, toutes taxes comprises (TTC).</p>
              
              <div className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6">
                <h4 className="text-white font-bold mb-2">2.1. Offre "Pack Fondateur"</h4>
                <p className="mb-4">L'offre "Pack Fondateur" est proposée à un prix unique de <strong className="text-white">997€ TTC</strong>, payable en une seule fois. Cette offre comprend :</p>
                <ul className="space-y-2 text-sm">
                  {["Configuration manuelle de votre modèle d'IA dédié", "Ingestion de jusqu'à 20 anciens dossiers techniques", "Support VIP direct fondateur", "Garantie \"Satisfait ou Remboursé\" sur le premier dossier"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wide">2.2. Abonnements futurs</h4>
              <p className="mb-4 text-sm">Des formules d'abonnement mensuel ou annuel pourront être proposées ultérieurement.</p>

              <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wide">2.3. Modalités de paiement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><span className="text-indigo-400">●</span> Paiement en ligne sécurisé via Stripe (carte bancaire)</li>
                <li className="flex gap-2"><span className="text-indigo-400">●</span> Virement bancaire sur demande</li>
              </ul>
            </LegalSection>

            <LegalSeparator />

            {/* Article 3 */}
            <LegalSection title="Article 3 : Confidentialité (NDA)" icon={Lock}>
              <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <p className="text-indigo-200 text-sm font-medium">
                  <ShieldCheck className="inline-block w-4 h-4 mr-2 -mt-1" />
                  CloserAI s'engage à maintenir la plus stricte confidentialité concernant tous les documents, données et informations communiqués par le Client.
                </p>
              </div>

              <h4 className="text-white font-bold mb-1">3.1. Protection des documents</h4>
              <p className="mb-4">Tous les documents uploadés (PDF, Word, CCTP, anciens mémoires) sont traités avec la plus grande confidentialité.</p>

              <h4 className="text-white font-bold mb-1">3.2. Isolation des données (Silo)</h4>
              <p className="mb-4">CloserAI garantit que les données du Client <strong className="text-white">ne sont en aucun cas partagées, accessibles ou utilisées</strong> par d'autres clients. Chaque Client dispose d'un environnement isolé.</p>

              <h4 className="text-white font-bold mb-1">3.3. Utilisation exclusive</h4>
              <p className="mb-4">Les données ne servent qu'à entraîner VOTRE modèle. Elles ne sont pas utilisées pour entraîner des modèles génériques ou pour d'autres clients.</p>

              <h4 className="text-white font-bold mb-1">3.4. Engagement de non-divulgation</h4>
              <p>CloserAI s'engage à ne pas divulguer, vendre ou céder vos données à des tiers.</p>
            </LegalSection>

            <LegalSeparator />

            {/* Article 4 */}
            <LegalSection title="Article 4 : Responsabilité" icon={AlertTriangle}>
              <h4 className="text-white font-bold mb-1">4.1. Obligation de moyens</h4>
              <p className="mb-4">
                CloserAI est soumis à une <strong className="text-white">obligation de moyens</strong> et non de résultat. C'est un outil d'aide à la rédaction qui ne remplace pas l'expertise du Client.
              </p>

              <h4 className="text-white font-bold mb-1">4.2. Responsabilité du Client</h4>
              <p className="mb-4">Le Client reste seul responsable de la vérification et de la validation du contenu généré, ainsi que de la soumission finale aux acheteurs publics.</p>

              <h4 className="text-white font-bold mb-1">4.3. Limitation</h4>
              <p>CloserAI ne peut être tenu responsable de la perte d'un appel d'offres. La responsabilité est limitée au montant versé par le Client.</p>
            </LegalSection>

            <LegalSeparator />

            {/* Article 5 */}
            <LegalSection title="Article 5 : Propriété Intellectuelle" icon={FileCheck}>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-white/10 p-1 rounded text-white shrink-0 h-fit"><ArrowRight size={12} /></div>
                  <div>
                    <strong className="text-white block text-sm mb-1">5.1. Vos Données</strong>
                    Le Client reste <strong className="text-white">propriétaire exclusif</strong> de ses anciens dossiers et documents fournis.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-white/10 p-1 rounded text-white shrink-0 h-fit"><ArrowRight size={12} /></div>
                  <div>
                    <strong className="text-white block text-sm mb-1">5.2. Notre Technologie</strong>
                    La plateforme, les algorithmes et le code source restent la propriété exclusive de CloserAI.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-white/10 p-1 rounded text-white shrink-0 h-fit"><ArrowRight size={12} /></div>
                  <div>
                    <strong className="text-white block text-sm mb-1">5.3. Contenus Générés</strong>
                    Les mémoires techniques générés deviennent la <strong className="text-white">propriété du Client</strong> dès paiement complet. Vous disposez d'un droit d'utilisation total et sans restriction.
                  </div>
                </li>
              </ul>
            </LegalSection>

            <LegalSeparator />

            {/* Article 6 */}
            <LegalSection title="Article 6 : Garantie Remboursement" icon={ShieldCheck}>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1 bg-emerald-500 rounded-full text-slate-950"><Check size={12} strokeWidth={3} /></div>
                  <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Satisfait ou Remboursé</h4>
                </div>
                <p className="text-emerald-100/80 text-sm">
                  Pour l'offre "Pack Fondateur", si le premier mémoire généré ne répond pas à vos attentes, nous vous remboursons intégralement.
                </p>
              </div>
              <p className="mb-2"><strong className="text-white">Conditions :</strong> Demande sous 30 jours après la première génération, via email à <a href="mailto:contactcloserai@gmail.com" className="text-indigo-400 hover:text-white">contactcloserai@gmail.com</a>.</p>
              <p><strong className="text-white">Remboursement :</strong> Effectué sous 14 jours ouvrés (997€ TTC).</p>
            </LegalSection>

            <LegalSeparator />

            {/* Article 7 */}
            <LegalSection title="Article 7 : Litiges" icon={Scale}>
              <p>
                Les présentes CGV/CGU sont régies par le <strong className="text-white">droit français</strong>. Tout litige relève de la compétence exclusive des tribunaux français.
              </p>
              <p className="mt-2">
                Médiation de la consommation disponible conformément à l'article L. 612-1 du Code de la consommation.
              </p>
            </LegalSection>

          </SpotlightCard>
          </motion.div>
      </div>
    </section>
  );
};

// ==============================================
// 🧱 LANDING SECTIONS (Existing)
// ==============================================
// Note: I'm keeping your existing sections compacted here for brevity in the Paste.
// The Hero, Features, WhyUs, Comparison, Pricing, FAQ, BookingWidget components 
// should remain exactly as they were in your provided code.

// ... (Assuming Hero, Features, WhyUs, Comparison, Pricing, FAQ, BookingWidget are defined here as per your code) ...
// RE-INSERTING THEM FOR COMPLETENESS so you can copy-paste the whole file.

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]); 
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-indigo-600/10 opacity-40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-0 w-[50vw] h-[60vh] bg-purple-900/10 opacity-30 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex justify-center lg:justify-start w-full lg:w-auto mb-8">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
                Programme Fondateur : 2 places restantes
                </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-[-0.04em] leading-[0.95] mb-10">
              <div className="overflow-hidden py-1"><motion.span className="block" variants={itemVariants}>Ne rédigez plus</motion.span></div>
              <div className="overflow-hidden py-1">
                  <motion.span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 pb-2" variants={itemVariants}>
                      Mémoires Techniques
                  </motion.span>
              </div>
              <div className="overflow-hidden py-1"><motion.span className="block text-slate-400" variants={itemVariants}>à la main.</motion.span></div>
            </h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              L'IA qui analyse vos anciens dossiers gagnants pour générer des réponses techniques ultra-personnalisées en 15 minutes.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <PrimaryButton href="#pricing" icon={ArrowRight}>
                Voir l'offre Fondateur
              </PrimaryButton>
              
              <motion.a 
                href="#process"
                onClick={(e) => scrollToSectionId('process', e)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 text-slate-300 font-medium rounded-2xl flex items-center justify-center gap-3 transition-colors hover:text-white group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500 transition-colors">
                     <PlayCircle size={16} className="ml-0.5" />
                </div>
                Comment ça marche
              </motion.a>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center lg:justify-start gap-6 opacity-80">
               <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020408] bg-slate-800 relative overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?img=${i*10 + 5}`} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                    </div>
                  ))}
               </div>
               <div className="text-sm text-slate-400">
                 <div className="flex items-center gap-1 text-indigo-400 mb-1">
                    <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                 </div>
                 <span className="font-bold text-white">Adopté par 8 PME</span> du BTP
               </div>
            </motion.div>
          </motion.div>

          <motion.div 
            style={{ y: y1, opacity, perspective: 2000 }} 
            className="relative hidden lg:block w-full h-[600px]"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 blur-[100px] opacity-50 -z-10" />

            <motion.div 
              initial={{ rotateY: -12, rotateX: 5, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: -4, rotateX: -2, opacity: 1, scale: 1 }}
              transition={{ 
                opacity: { duration: 1, delay: 0.5 },
                scale: { duration: 1, delay: 0.5 },
                default: { 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  duration: 8, 
                  ease: "easeInOut" 
                }
              }}
              className="absolute inset-0 z-10"
            >
              <div className="relative w-full h-full bg-[#0A0F1C] rounded-[2rem] shadow-2xl shadow-indigo-900/40 overflow-hidden group border border-white/10">
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] rounded-[2rem] pointer-events-none z-30" />
                  <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[2rem] pointer-events-none z-30" />
                  
                  <div className="absolute top-0 w-full h-12 border-b border-white/5 bg-[#0A0F1C]/90 backdrop-blur-md flex items-center px-6 gap-4 z-20">
                      <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                      <div className="mx-auto px-4 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-slate-400 flex items-center gap-2">
                          <Lock size={10} className="text-emerald-400" /> closerai.app/editor
                        </div>
                    </div>

                  <div className="absolute inset-0 pt-20 px-8 pb-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 bg-repeat mix-blend-overlay" />
                  
                  <div className="absolute inset-0 pt-20 px-10 flex flex-col gap-6">
                      <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                              <Brain size={18} />
                            </div>
                          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                              <div className="h-2 bg-slate-700 rounded-full w-24 mb-2 opacity-50" />
                              <div className="h-2 bg-slate-700 rounded-full w-48 opacity-30" />
                            </div>
                        </div>

                        <motion.div 
                          initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
                          className="ml-auto bg-gradient-to-b from-indigo-950/40 to-[#0F1525] p-6 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden max-w-[90%]"
                        >
                          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                                  <Sparkles size={12} /> Génération
                                </div>
                              <div className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-500/20">Word .docx</div>
                            </div>
                            
                          <div className="space-y-2 text-sm text-slate-200 leading-relaxed font-medium font-serif">
                              <p>"Concernant le lot n°2 (Gros Œuvre), notre méthodologie privilégie l'approche bas carbone..."</p>
                                <motion.span 
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                  className="inline-block w-1.5 h-4 bg-indigo-400 ml-0.5 align-middle shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
                                />
                            </div>

                          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                <CheckCircle size={12} /> CCTP respecté
                              </div>
                              <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                                <BrainCircuit size={12} /> Style expert
                              </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const items = [
    { icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", title: "Chronophage", desc: "Vos soirées et weekends perdus à copier-coller des textes au lieu de piloter vos chantiers." },
    { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", title: "Risque d'erreur", desc: "Un nom de client oublié, une certification périmée, et le contrat est perdu bêtement." },
    { icon: Coins, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Coût cachés", desc: "Payer un bureau d'études externe une fortune juste pour de la mise en forme standard." }
  ];

  return (
    <section id="fonctionnalités" className="relative py-32 bg-[#020408]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionTitle 
          eyebrow="Problématique"
          title="L'enfer des Appels d'Offres"
          subtitle="Pourquoi vous perdez du temps et de l'argent aujourd'hui."
        />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {items.map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="h-full">
              <SpotlightCard className="p-8 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={24} className={item.color} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const items = [
    { 
      icon: BrainCircuit, 
      title: "Entraînement Sur-Mesure", 
      desc: "Nous ingérons vos 10 à 20 meilleurs mémoires techniques. L'IA clone votre style, votre vocabulaire et votre expertise métier." 
    },
    { 
      icon: FileOutput, 
      title: "Export Word Prêt à Signer", 
      desc: "Fini le copier-coller. Recevez un .docx parfaitement formaté avec vos en-têtes, polices et mises en page habituelles." 
    },
    { 
      icon: ShieldCheck, 
      title: "Données Isolées & Sécurisées", 
      desc: "Vos données techniques sont votre or noir. Elles sont stockées dans un silo hermétique, jamais partagées avec l'extérieur." 
    }
  ];

  return (
    <section id="pourquoi-nous" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <SectionTitle 
          eyebrow="NOTRE DIFFÉRENCE"
          title="Votre expert technique virtuel."
          subtitle="Contrairement à ChatGPT générique, CloserAi connaît votre entreprise par cœur."
        />
        
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, type: "spring" }}
              className="group"
            >
              <SpotlightCard className="p-8 h-full flex flex-col bg-[#0E131F]/50" spotlightColor="rgba(255,255,255,0.1)">
                <div className="mb-6 relative inline-block">
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center text-indigo-300 group-hover:text-white transition-colors">
                        <item.icon size={24} />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Comparison = () => {
  return (
    <section id="process" className="py-40 relative overflow-hidden bg-[#020408]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <SectionTitle 
          eyebrow="IMPACT DIRECT"
          title="La victoire se joue au détail près."
          subtitle={
            <span>
              Dans les appels d'offres publics, la note technique représente souvent <strong className="text-indigo-400">60% de la note finale</strong>.
            </span>
          }
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative group"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 text-xs font-mono">METHODE_TRADITIONNELLE</div>
            <div className="flex items-center gap-4 mb-8 text-slate-500">
              <div className="p-2 bg-slate-800 rounded-lg"><FileText size={20} /></div>
              <span className="font-bold uppercase tracking-widest text-xs text-slate-400">Rédaction Manuelle</span>
            </div>
            <div className="mb-8 pl-2">
               <div className="text-6xl font-black text-slate-700 tracking-tighter">35<span className="text-2xl text-slate-800 font-medium">/60</span></div>
            </div>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
                <li className="flex items-center gap-3"><XCircle size={16} className="text-red-900/50" /> Copier-coller générique détecté</li>
                <li className="flex items-center gap-3"><XCircle size={16} className="text-red-900/50" /> Méthodologie standardisée</li>
            </ul>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative z-10 w-full"
          >
            <SpotlightCard className="p-10 !bg-[#0F1623] border-indigo-500/30 transform lg:scale-110 shadow-[0_0_50px_-10px_rgba(99,102,241,0.15)] relative overflow-visible" noHover={true}>
              
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-2xl -z-10 rounded-[2rem]" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-indigo-400">
                  <div className="p-2 bg-indigo-500/20 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"><Zap size={20} fill="currentColor" /></div>
                  <span className="font-bold uppercase tracking-widest text-xs text-white">CloserAI</span>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  Optimisé
                </div>
              </div>
              
              <div className="mb-8 pl-2">
                <div className="text-7xl font-black text-white tracking-tighter flex items-baseline drop-shadow-2xl">
                  <AnimatedCounter value={58} /><span className="text-2xl text-slate-500 font-medium ml-2">/60</span>
                </div>
              </div>

              <ul className="space-y-4 text-slate-300 text-sm font-medium mb-8">
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-emerald-400" /> Réponse 100% alignée au CCTP</li>
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-emerald-400" /> Expertise technique valorisée</li>
              </ul>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs w-full justify-center shadow-lg shadow-indigo-500/20">
                    <Check size={16} strokeWidth={4} /> Marché Attribué
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="relative py-40 overflow-hidden bg-[#020408]">
      {/* Background Lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/20 blur-[150px] rounded-full pointer-events-none opacity-40" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <SectionTitle 
          eyebrow="OFFRE DE LANCEMENT"
          title="Devenez Partenaire Fondateur"
          subtitle="Nous limitons l'accès pour garantir une qualité de service exceptionnelle aux premiers utilisateurs."
        />

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
          
          {/* --- CARD 1 (Basic) --- */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] text-center"
          >
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Accès Public</h3>
            <div className="text-3xl font-bold text-slate-600 mb-2 font-mono">Q1 2026</div>
            <button disabled className="mt-8 w-full py-3 bg-transparent border border-white/5 rounded-xl text-slate-600 text-xs font-bold cursor-not-allowed uppercase tracking-wider">
              Liste d'attente
            </button>
          </motion.div>

          {/* --- CARD 2 (Founder - REDESIGNED) --- */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative z-10 lg:scale-105"
          >
            <SpotlightCard className="p-10 !bg-[#0E131F] border-indigo-500/40 relative flex flex-col items-center text-center shadow-2xl shadow-black/50 overflow-hidden">
              
              {/* 1. Badge "Glowing Chip" - Plus fin, plus lumineux */}
              <div className="mb-8">
                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/50 text-indigo-300 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Sparkles size={10} className="mr-2" /> Recommandé
                </span>
              </div>

              {/* 2. Hierarchy Typographique - Prix Hero */}
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Pack Fondateur</h3>
              <div className="flex items-baseline justify-center gap-2 mb-8 relative">
                <span className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">997€</span>
                <div className="flex flex-col items-start">
                   <span className="text-slate-500 text-[10px] font-bold uppercase leading-tight">/ Paiement</span>
                   <span className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Unique</span>
                </div>
              </div>
              
              {/* 3. Zone Garantie - Plus lumineuse (Emerald) */}
              <div className="w-full mb-10 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wide">Garantie Satisfait ou Remboursé</span>
              </div>
              
              {/* CTA */}
              <div className="w-full mb-10">
                <PrimaryButton href="https://buy.stripe.com/3cI14pgHX9Uxd0q13k6g800" icon={Lock}>
                Sécuriser ma place
              </PrimaryButton>
                <p className="text-[10px] text-slate-500 mt-3 font-medium">Facture avec TVA disponible immédiatement</p>
              </div>

              {/* 4. Liste Avantages - Coches blanches sur fond Indigo */}
              <div className="border-t border-white/10 pt-8 w-full space-y-5 text-left">
                {[
                  "Configuration sur-mesure par l'équipe",
                  "Ingestion de 20 dossiers historiques",
                  "Accès à vie aux futures mises à jour",
                  "Support WhatsApp direct fondateurs"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 text-sm text-slate-300 font-medium group">
                    <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-300">
                        <Check size={12} strokeWidth={3} className="text-white" />
                    </div>
                    <span className="group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>

          {/* --- CARD 3 (Enterprise) --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] text-center group hover:border-white/10 transition-colors"
          >
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Grands Groupes</h3>
            <div className="text-3xl font-bold text-white mb-2">Sur Devis</div>
            <a href="mailto:contact@closerai.fr" className="block mt-8 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl text-white text-xs font-bold transition-all uppercase tracking-wider">
              Nous contacter
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const questions = [
    { question: "Mes données techniques (fichiers Word, prix) sont-elles en sécurité ?", answer: "Absolument. La sécurité est notre priorité n°1. Vos données sont stockées dans des silos isolés et chiffrés. Elles ne sont JAMAIS utilisées pour entraîner des modèles publics ou accessibles par d'autres clients." },
    { question: "Est-ce que le texte généré va ressembler à du robot ?", answer: "Non. Contrairement à ChatGPT standard, CloserAI analyse votre 'ton de voix' et votre vocabulaire technique spécifique à partir des mémoires que vous nous fournissez. Le résultat est indiscernable d'un texte écrit par vos ingénieurs." },
    { question: "Est-ce compatible avec Microsoft Word ?", answer: "Oui à 100%. L'outil génère un fichier .docx natif qui respecte vos en-têtes, pieds de page et styles de titres habituels. Vous n'avez aucune remise en page complexe à faire." },
    { question: "Combien de mémoires dois-je fournir pour l'entraînement ?", answer: "Pour des résultats optimaux (le Pack Fondateur), nous recommandons d'ingérer entre 10 et 20 de vos meilleurs dossiers gagnants passés. Cela permet à l'IA de couvrir une large gamme de questions techniques." },
    { question: "Comment fonctionne la garantie Satisfait ou Remboursé ?", answer: "C'est très simple : si après 30 jours et la phase de configuration, vous estimez que l'outil ne vous fait pas gagner au moins 2h par dossier, nous vous remboursons intégralement, sans poser de questions." }
  ];

  return (
    <section className="relative py-24 bg-[#020408]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionTitle eyebrow="QUESTIONS FRÉQUENTES" title="Vos doutes, nos réponses." subtitle="Tout ce que vous devez savoir avant de sécuriser votre place." />
        <div className="max-w-3xl mx-auto grid gap-4">
          {questions.map((q, i) => (
  <motion.div 
              key={i}
    initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              className={cn(
                "group cursor-pointer rounded-2xl border bg-[#0B101B] overflow-hidden transition-all duration-300",
                activeIndex === i ? "border-indigo-500/50 shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)]" : "border-white/5 hover:border-indigo-500/30"
              )}
            >
              <div className="p-6 flex items-center justify-between gap-4">
                <h3 className={cn("font-bold text-lg transition-colors", activeIndex === i ? "text-white" : "text-slate-300 group-hover:text-white")}>
                  {q.question}
                </h3>
                <div className={cn(
                  "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0",
                  activeIndex === i ? "bg-indigo-500 border-indigo-500 rotate-45 text-white" : "bg-white/5 border-white/10 text-slate-400 group-hover:border-white/30"
                )}>
                  <Plus size={18} />
                </div>
              </div>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="px-6 pb-6 text-slate-400 leading-relaxed text-sm font-medium">
                      {q.answer}
    </div>
  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BookingWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const pricingSection = document.getElementById('pricing');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isClosed) setIsVisible(true);
    }, { threshold: 0.1 });
    if (pricingSection) observer.observe(pricingSection);
    return () => observer.disconnect();
  }, [isClosed]);

  if (isClosed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 w-[320px] bg-[#0F1623] border border-indigo-500/30 shadow-2xl shadow-black/80 rounded-2xl overflow-hidden ring-1 ring-white/10"
        >
          <button onClick={() => setIsClosed(true)} className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"><X size={14}/></button>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                   <img src="https://i.pravatar.cc/150?img=68" alt="Julien" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0F1623] rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="font-bold text-white text-sm">Julien</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Fondateur</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">Il ne reste que <span className="text-indigo-400 font-bold">2 places</span> cette semaine pour l'offre Fondateur.</p>
            <div className="w-full bg-slate-800/50 rounded-full h-1 mb-5 overflow-hidden">
              <div className="bg-indigo-500 h-full w-[85%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
            <a href="https://calendly.com/julien-pernot74/30min" target="_blank" className="block w-full py-3 bg-white text-slate-950 hover:bg-indigo-50 text-center rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg">
              Réserver mon audit
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==============================================
// 🧲 HOOKS & UTILS
// ==============================================

// Scroll Spy Hook with IntersectionObserver
const useActiveSection = (sectionIds) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observers = [];
    
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Trigger when the section is intersecting properly
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          // Offset to handle the fixed header height and trigger earlier
          rootMargin: "-15% 0px -50% 0px", 
          threshold: 0.1 
        }
      );
      
      observer.observe(element);
      observers.push(observer);
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, [sectionIds]);
  return activeSection;
};

// ==============================================
// 🧩 NAVBAR COMPONENT
// ==============================================

const Navbar = ({ setView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  
  // Define Navigation Data - LABELS UPDATED TO MATCH CONTENT
  const navLinks = [
    { label: 'Problématique', id: 'fonctionnalités' },
    { label: 'Notre Solution', id: 'pourquoi-nous' },
    { label: "L'Impact", id: 'process' },
    { label: "L'Offre", id: 'pricing' }
  ];

  // Connect ScrollSpy
  const activeSection = useActiveSection(navLinks.map(link => link.id));

  // Scroll Listener for container styles
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setView('home');
    
    // Calculate offset for the fixed navbar
    const element = document.getElementById(sectionId);
    if (element) {
      // Use smaller offsets for specific sections to scroll down more
      const offset = sectionId === 'process' ? -40 : sectionId === 'pricing' ? -60 : 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-full z-50 top-0 left-0 flex justify-center pointer-events-none"
      >
        <div 
          className={cn(
            "pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-between",
            isScrolled 
              ? "mt-6 w-[90%] max-w-4xl rounded-full bg-[#0B101B]/70 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 py-3 px-6" 
              : "mt-0 w-full max-w-[1280px] bg-transparent border-transparent py-6 px-6 sm:px-8"
          )}
        >
          {/* --- Logo --- */}
          <button onClick={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} className="flex items-center gap-3 group shrink-0">
            <div className={cn(
              "relative w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-300",
              isScrolled 
                ? "bg-indigo-500 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                : "bg-white/5 border-white/10 group-hover:border-indigo-500/50 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]"
            )}>
               <Sparkles className={cn("w-4 h-4 transition-colors", isScrolled ? "text-white" : "text-indigo-400")} />
            </div>
            <span className={cn("text-lg font-bold tracking-tight transition-colors", isScrolled ? "hidden sm:block" : "text-white")}>
              CloserAI
            </span>
          </button>

          {/* --- Desktop Liquid Navigation --- */}
          <nav className="hidden md:flex items-center gap-1">
             <ul 
               onMouseLeave={() => setHoveredTab(null)}
               className={cn(
                 "flex items-center gap-1 p-1 rounded-full transition-colors",
                 !isScrolled && "bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm"
               )}
             >
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  const isHovered = hoveredTab === link.id;
                  // The pill is shown if the item is hovered OR if it's active and nothing else is hovered.
                  const showPill = isHovered || (isActive && !hoveredTab);

                  return (
                    <li key={link.id} className="relative z-0">
                      <a 
                        href={`#${link.id}`}
                        onClick={(e) => scrollToSection(link.id, e)}
                        onMouseEnter={() => setHoveredTab(link.id)}
                        className={cn(
                          "relative z-10 block px-4 py-2 text-xs font-medium transition-colors duration-200",
                          isActive || isHovered ? "text-white" : "text-slate-400 hover:text-slate-200"
                        )}
                      >
                        {link.label}
                      </a>
                      
                      {/* THE LIQUID PILL */}
                      {showPill && (
                        <motion.div
                          layoutId="navbar-pill"
                          className="absolute inset-0 bg-white/10 rounded-full z-0"
                          transition={{ 
                            type: "spring", 
                            stiffness: 350, 
                            damping: 25 
                          }}
                        />
                      )}
                    </li>
                  );
                })}
             </ul>
          </nav>

          {/* --- CTA & Mobile Toggle --- */}
          <div className="flex items-center gap-4">
            {/* --- CTA Button (Correction) --- */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('demo')}
              className={cn(
                // AJOUT DE 'shrink-0' et 'whitespace-nowrap' pour empêcher l'écrasement
                "hidden md:flex shrink-0 items-center gap-2 border px-5 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap",
                isScrolled 
                  ? "bg-white text-slate-950 border-white hover:bg-slate-200" // Mode scroll : Fond blanc, texte noir
                  : "bg-[#131B2D] text-white border-indigo-500/30 hover:bg-indigo-500/20 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]" // Mode top
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isScrolled ? "bg-indigo-600" : "bg-indigo-400")} />
              
              {/* Simplification du texte pour garantir l'affichage */}
              <span>Réserver démo</span>
            </motion.button>

            <button 
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>
      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#020408]/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <motion.button 
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              onClick={() => setMobileMenuOpen(false)} 
              className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X />
            </motion.button>

            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex flex-col items-center gap-8"
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(link.id, e)}
                  className={cn(
                    "text-4xl font-bold tracking-tight transition-colors",
                    activeSection === link.id ? "text-indigo-400" : "text-white hover:text-indigo-300"
                  )}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="pt-8"
              >
                <motion.button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setView('demo');
                  }}
                  className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl overflow-hidden shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-white to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-background-shine" />
                  <span className="relative flex items-center gap-2 z-10 text-sm uppercase tracking-wide">
                    Réserver ma démo <ArrowRight size={16} className="text-indigo-600" />
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = ({ setView }) => (
  <footer className="border-t border-white/5 bg-[#020408] pt-20 pb-10 relative z-10">
    <div className="max-w-[1280px] mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <button onClick={() => setView('home')} className="flex items-center gap-2 mb-6 group">
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-indigo-500/50 transition-colors">
               <Sparkles className="text-indigo-400 w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">CloserAI</span>
          </button>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
            L'intelligence artificielle dédiée aux experts du BTP et de la Sécurité pour gagner plus d'appels d'offres.
          </p>
        </div>
        <div className="md:text-right">
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Contact</h4>
          <a href="mailto:contactcloserai@gmail.com" className="text-slate-400 hover:text-indigo-400 transition-colors block mb-2 text-sm">contactcloserai@gmail.com</a>
          <p className="text-slate-600 text-xs">Paris, France</p>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-medium">
        <p>&copy; 2025 CloserAI. Tous droits réservés.</p>
        <div className="flex gap-6">
          <button onClick={() => setView('mentions')} className="hover:text-white transition-colors">Mentions légales</button>
          <button onClick={() => setView('cgv')} className="hover:text-white transition-colors">CGV</button>
        </div>
      </div>
    </div>
  </footer>
);

// ==============================================
// 📅 DEMO BOOKING VIEW (NEW)
// ==============================================

// ==============================================
// 📅 DEMO BOOKING VIEW (REFACTORED)
// ==============================================

const DemoView = ({ onBack }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  const form = useRef();
  const [status, setStatus] = useState('idle'); // 'idle', 'sending', 'success', 'error'

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('sending');

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          setStatus('success');
      }, (error) => {
          console.log(error.text);
          setStatus('error');
      });
  };

  // Fonction pour n'accepter que les chiffres dans le champ téléphone
  const handlePhoneInput = (e) => {
    // Remplace tout ce qui n'est pas un chiffre par une chaîne vide
    e.target.value = e.target.value.replace(/\D/g, '');
  };

  const handlePhoneKeyPress = (e) => {
    // Empêche la saisie de caractères non numériques
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  // --- ÉCRAN DE SUCCÈS ---
  if (status === 'success') {
    return (
      <section className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
         {/* Background Ambiance */}
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-indigo-600/10 opacity-30 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full p-8 bg-[#0B101B]/80 border border-emerald-500/30 rounded-3xl text-center shadow-2xl shadow-emerald-900/20 backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Demande Envoyée !</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Merci ! Notre équipe a bien reçu votre demande. Nous revenons vers vous sous 24h pour planifier votre démo.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </section>
    );
  }

  // --- ÉCRAN FORMULAIRE ---
  return (
    <section className="min-h-screen pt-32 pb-20 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-indigo-600/10 opacity-30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-purple-900/10 opacity-20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-6 relative z-10">
        
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack} 
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors mb-8 mx-auto md:mx-0"
        >
          <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-indigo-500/10 transition-all group-hover:-translate-x-1">
            <ArrowLeft size={16} />
          </div>
          Retour
        </motion.button>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12 items-start"
        >
          {/* Left Side Text */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <motion.div variants={item}>
               <div className="flex items-center gap-2 mb-6">
                  <span className="h-px w-8 bg-indigo-500/50"></span>
                  <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">PASSEZ À L'ACTION</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                 Prêt à bénéficier d'une <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">démonstration gratuite ?</span>
               </h1>
               <p className="text-slate-400 text-lg leading-relaxed">
                 Remplissez ce formulaire pour recevoir votre audit personnalisé.
               </p>
            </motion.div>
            <motion.div variants={item} className="space-y-4">
              {[
                { text: "Audit gratuit de vos mémoires actuels", icon: FileText },
                { text: "Démonstration live sur vos données", icon: PlayCircle },
                { text: "Accès prioritaire au programme", icon: Star }
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><feat.icon size={18} /></div>
                  <span className="text-slate-300 font-medium text-sm">{feat.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side Form */}
          <div className="lg:col-span-7">
            <motion.div variants={item}>
              <SpotlightCard className="p-8 md:p-10 !bg-[#0B101B]/80 shadow-2xl shadow-black/50" spotlightColor="rgba(99, 102, 241, 0.15)">
                
                {/* --- LE FORMULAIRE --- */}
                <form ref={form} onSubmit={sendEmail} className="grid md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Société</label>
                    <input required name="company" type="text" placeholder="Nom de votre société" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none text-sm font-medium" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Taille d'entreprise</label>
                    <div className="relative">
                      <select name="company_size" className="w-full appearance-none bg-[#0B101B] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none text-sm font-medium cursor-pointer">
                        <option value="1-10">1-10 employés</option>
                        <option value="11-50">11-50 employés</option>
                        <option value="50+">+50 employés</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Prénom</label>
                    <input required name="firstname" type="text" placeholder="Votre prénom" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none text-sm font-medium" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom</label>
                    <input required name="lastname" type="text" placeholder="Votre nom" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none text-sm font-medium" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Adresse e-mail <span className="text-indigo-400">*</span></label>
                    <input required name="email" type="email" placeholder="votre@email.com" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none text-sm font-medium" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Téléphone</label>
                    <input 
                      required 
                      name="phone" 
                      type="tel" 
                      placeholder="0612345678" 
                      onInput={handlePhoneInput}
                      onKeyPress={handlePhoneKeyPress}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none text-sm font-medium" 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Message (Optionnel)</label>
                    <textarea name="message" placeholder="Parlez-nous de vos besoins actuels..." className="w-full min-h-[120px] bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none text-sm font-medium resize-none"></textarea>
                  </div>

                  {/* Message d'erreur */}
                  {status === 'error' && (
                    <div className="md:col-span-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                        <XCircle className="text-red-400 shrink-0" size={20} />
                        <p className="text-red-200 text-sm">Une erreur est survenue. Vérifiez votre connexion ou réessayez plus tard.</p>
                    </div>
                  )}

                  {/* Bouton Submit */}
                  <div className="md:col-span-2 pt-4">
                    <button 
                      disabled={status === 'sending'}
                      type="submit"
                      className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-xl overflow-hidden shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? (
                         <><Loader2 className="animate-spin" /> Envoi en cours...</>
                      ) : (
                         <>
                           <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-white to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-background-shine" />
                           <span className="relative flex items-center gap-2 z-10 text-sm uppercase tracking-wide">
                             Envoyer la demande <ArrowRight size={16} className="text-indigo-600" />
                           </span>
                         </>
                      )}
                    </button>
                  </div>
                </form>

              </SpotlightCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==============================================
// 🚀 APP ENTRY
// ==============================================

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="font-sans bg-[#020408] text-slate-200 min-h-screen selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        @keyframes background-shine {
          from { background-position: 0 0; }
          to { background-position: -200% 0; }
        }
        .animate-background-shine { animation: background-shine 3s linear infinite; }
      `}</style>

      <Navbar setView={setCurrentView} />
      
      <main className="relative z-10">
        {currentView === 'home' && (
          <>
            <Hero />
            <Features />
            <Comparison />
            <WhyUs />
            <Pricing />
            <FAQ />
            <BookingWidget />
          </>
        )}
        {currentView === 'mentions' && (
          <MentionsLegales onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'cgv' && (
          <CGV onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'demo' && (
          <DemoView onBack={() => setCurrentView('home')} />
        )}
      </main>

      <Footer setView={setCurrentView} />
      
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </div>
  );
}