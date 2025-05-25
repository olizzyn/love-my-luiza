import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Heart, HeartHandshake, Calendar, Clock, Sparkles, Star } from 'lucide-react';

import imgMine from './assets/image.png'
import imgNois from './assets/image2.png'
import imgOwnti from './assets/image3.jpg'

const RomanticPage = () => {
  const [showProposal, setShowProposal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonText, setNoButtonText] = useState('Não...');
  const [noButtonMoves, setNoButtonMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState({ months: 0, days: 0, hours: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Parallax scroll
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  
  // Calcular tempo desde que se conheceram
  useEffect(() => {
    const calculateTime = () => {
      const startDate = new Date('2025-02-13');
      const now = new Date();
      const diff = now - startDate;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const months = Math.floor(days / 30);
      
      setTimeElapsed({ months, days, hours });
    };
    
    calculateTime();
    const interval = setInterval(calculateTime, 1000 * 60);
    
    return () => clearInterval(interval);
  }, []);
  
  // Componente de coração flutuante animado
  const FloatingHeart = ({ index }) => {
    const hearts = ['💜', '💕', '💖', '💗', '💓', '💘', '❤️'];
    const heart = hearts[Math.floor(Math.random() * hearts.length)];
    
    return (
      <motion.div
        className="absolute pointer-events-none text-2xl"
        initial={{ 
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 100,
          rotate: 0,
          opacity: 0 
        }}
        animate={{ 
          y: -100,
          rotate: 360,
          opacity: [0, 0.7, 0.7, 0]
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          delay: index * 0.5,
          ease: "linear"
        }}
      >
        {heart}
      </motion.div>
    );
  };
  
  // Componente da Timeline com Framer Motion
  const TimelineItem = ({ date, title, description, icon, position, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    const itemVariants = {
      hidden: { 
        opacity: 0, 
        x: isMobile ? 0 : (position === 'left' ? -100 : 100),
        y: 50
      },
      visible: { 
        opacity: 1, 
        x: 0,
        y: 0,
        transition: {
          type: "spring",
          duration: 0.8,
          delay: index * 0.2,
          bounce: 0.3
        }
      }
    };
    
    // Mobile Layout
    if (isMobile) {
      return (
        <div ref={ref} className="relative flex mb-8">
          <div className="w-12 flex justify-center relative">
            <motion.div
              className="absolute w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: [0, 1.5, 1] } : { scale: 0 }}
              transition={{ delay: index * 0.2 + 0.3 }}
              style={{ top: "24px" }}
            />
          </div>
          
          <motion.div 
            className="flex-1 pl-4"
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-purple-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </h3>
              <p className="text-xs text-purple-600 mb-2">{date}</p>
              <p className="text-sm text-gray-600">{description}</p>
              <motion.span 
                className="text-2xl mt-2 block"
              >
                {icon}
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      );
    }
    
    // Desktop Layout
    return (
      <div ref={ref} className="relative flex items-center justify-between mb-16">
        {position === 'left' ? (
          <>
            <motion.div 
              className="w-5/12 text-right pr-8"
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-2xl transition-shadow relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent relative z-10">
                  {title}
                </h3>
                <p className="text-sm text-purple-600 mb-2 relative z-10">{date}</p>
                <p className="text-gray-600 relative z-10">{description}</p>
                <motion.span 
                  className="text-3xl mt-2 block relative z-10"
                >
                  {icon}
                </motion.span>
              </motion.div>
            </motion.div>
            
            <div className="w-2/12 flex justify-center relative">
              <motion.div
                className="absolute w-4 h-4 bg-purple-500 rounded-full"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: [0, 1.5, 1] } : { scale: 0 }}
                transition={{ delay: index * 0.2 + 0.3 }}
                style={{ top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
            
            <div className="w-5/12"></div>
          </>
        ) : (
          <>
            <div className="w-5/12"></div>
            
            <div className="w-2/12 flex justify-center relative">
              <motion.div
                className="absolute w-4 h-4 bg-pink-500 rounded-full"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: [0, 1.5, 1] } : { scale: 0 }}
                transition={{ delay: index * 0.2 + 0.3 }}
                style={{ top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
            
            <motion.div 
              className="w-5/12 pl-8"
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-2xl transition-shadow relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent relative z-10">
                  {title}
                </h3>
                <p className="text-sm text-purple-600 mb-2 relative z-10">{date}</p>
                <p className="text-gray-600 relative z-10">{description}</p>
                <motion.span 
                  className="text-3xl mt-2 block relative z-10"
                >
                  {icon}
                </motion.span>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    );
  };
  
  // Componente do Contador Animado
  const AnimatedCounter = ({ value, label, icon }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
    useEffect(() => {
      if (isInView) {
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setDisplayValue(value);
            clearInterval(timer);
          } else {
            setDisplayValue(Math.floor(current));
          }
        }, duration / steps);
        
        return () => clearInterval(timer);
      }
    }, [value, isInView]);
    
    return (
      <motion.div 
        ref={ref}
        className="relative group"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-200">
          <motion.div 
            className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            key={displayValue}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            {displayValue}
          </motion.div>
          <div className="text-gray-600 mt-2 flex items-center justify-center gap-2">
            {icon}
            {label}
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Função para mover o botão "Não"
  const handleNoHover = () => {
    const modalWidth = 500;
    const modalHeight = 400;
    const buttonWidth = 150;
    const buttonHeight = 50;
    
    const maxX = modalWidth - buttonWidth - 40;
    const maxY = modalHeight - buttonHeight - 100;
    
    setNoButtonPosition({
      x: Math.random() * maxX,
      y: Math.random() * maxY
    });
    
    setNoButtonMoves(prev => {
      const newCount = prev + 1;
      if (newCount > 3) setNoButtonText('Não adianta!');
      if (newCount > 5) setNoButtonText('Aceita logo! 💜');
      return newCount;
    });
  };
  
  // Slides do carrossel
  const slides = [
    { id: 1, alt: "Minezin", img: imgMine },
    { id: 2, alt: "Nois", img: imgNois },
    { id: 3, alt: "Ownti", img: imgOwnti },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 overflow-x-hidden">
      {/* Corações flutuantes no background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <FloatingHeart key={i} index={i} />
        ))}
      </div>
      
      {/* Header/Introdução com Parallax */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Gradiente animado de fundo */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Círculos decorativos flutuantes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-300 rounded-full blur-2xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div style={{ y: y1 }} className="absolute inset-0 opacity-10">
          <div className="text-[300px] font-bold text-purple-200 text-center">💜</div>
        </motion.div>
        
        {/* Elementos decorativos flutuantes pequenos */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`deco-${i}`}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + (i % 2) * 70}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <span className="text-4xl opacity-20">
              {['✨', '💫', '⭐', '🌟', '💜'][i]}
            </span>
          </motion.div>
        ))}
        
        <motion.div 
          className="text-center max-w-4xl relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Oii meu amor,{' '}
            <motion.span 
              className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Luiza
            </motion.span>{' '}
            <motion.span 
              className="inline-block"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💜
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Preparei algo especial para você meu bemm... Tudo foi pensado com muito carinho, porque você merece toodo o amor do mundo
          </motion.p>
          
          {/* Nova seção com estatísticas fofas */}
          <motion.div 
            className="grid grid-cols-3 gap-4 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{ 
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                ∞
              </motion.div>
              <p className="text-sm text-gray-500">Te amo</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{ 
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                24/7
              </motion.div>
              <p className="text-sm text-gray-500">Pensando em você</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{ 
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                100%
              </motion.div>
              <p className="text-sm text-gray-500">Apaixonado</p>
            </motion.div>
          </motion.div>
          
          <motion.button
            onClick={() => {
              const element = document.getElementById('timeline');
              const yOffset = -80; // Offset para não ficar colado no topo
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <HeartHandshake className="inline-block mr-2" size={20} />
            Te amo muitooo
          </motion.button>
          
          {/* Seta animada indicando scroll */}
          <motion.div 
            className="absolute flex justify-center w-full mt-20"
            animate={{ 
              y: [0, 10, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="text-purple-400 opacity-50 flex flex-col justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
            >
              <div>
                surpresinha pra baixo
              </div>
              <div>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Timeline Animada */}
      <section id="timeline" className="py-20 px-4 relative">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-4 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nosso tempo juntos{' '}
            <motion.span 
              className="inline-block"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💜
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Nos conhecemos a poquinho tempo, mas ja temos uma conexão muuuito forte
          </motion.p>
          
          <div className="relative">
            {/* Linha central animada - Desktop */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-400 to-pink-400 hidden md:block"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true }}
              style={{ top: 0 }}
            />
            
            {/* Linha lateral - Mobile */}
            <motion.div 
              className="absolute left-6 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400 md:hidden"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true }}
              style={{ top: 0 }}
            />
            
            <TimelineItem
              date="13 de Fevereiro de 2025"
              title="O dia que tudo começou"
              description="Quando nossos caminhos se cruzaram e eu conheci a pessoa mais incrível desse mundo."
              icon="🌟"
              position="left"
              index={0}
            />
            
            <TimelineItem
              date="9 de Abril de 2025"
              title="Primeiras conversas com a fofuxa"
              description="Cada mensagem, cada risada... Eu já sabia que havia algo especial em você."
              icon="💬"
              position="right"
              index={1}
            />
            
            <TimelineItem
              date="1 de Maio de 2025"
              title="Quando a verdadeira paixão chegou"
              description="Você mostrou todo o seu cuidado e carinho quando eu estava em um momento difícil. Foi quando percebi que estava completamente apaixonado por você."
              icon="✨"
              position="left"
              index={2}
            />
            
            <TimelineItem
              date="Hoje"
              title="Fiz a escolha certa"
              description="E hoje eu percebo, com o coração quentinho, que te amo mais a cada dia."
              icon="💕"
              position="right"
              index={3}
            />
          </div>
        </motion.div>
      </section>
      
      {/* Carrossel de fotos com Framer Motion */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={slides[activeSlide].img}
                    alt={slides[activeSlide].alt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Indicadores */}
              <div className="flex justify-center mt-4 gap-2">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeSlide === index ? 'bg-purple-600 w-8' : 'bg-gray-300 w-2'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>
              
              {/* Botões de navegação */}
              <motion.button
                onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg"
              >
                ←
              </motion.button>
              <motion.button
                onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg"
              >
                →
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Amo estar contigo, meu{' '}
              <motion.span 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-lg inline-block"
                whileHover={{ scale: 1.1 }}
              >
                amor
              </motion.span>
            </h2>
            <p className="text-gray-600 mb-6">
              Cada momento ao seu lado é único, eu me sinto muito feliz contigo. Você transformou minha vida em algo muuuito melhor, cheia de sorrisos e felicidade
            </p>
            <motion.button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(147, 51, 234, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="inline-block mr-2" size={20} />
              Você é meu mundinhoo
            </motion.button>
          </motion.div>
        </div>
      </section>
      
      {/* Card de declaração */}
      <section className="py-10 px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-200"
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(147, 51, 234, 0.2)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles className="inline-block mr-1" size={16} />
                Para você
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Por que eu te amo tanto</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Desde que você entrou na minha vida, tudo ficou mais leve, mais bonito e cheio de carinho. O seu jeitinho tão atencioso, doce e carinhoso, esse seu rostinho simplesmente lindo e perfeitinho, me faz sentir um quentinho no coração toda vez que penso em você. Cada momento ao seu lado é especial, até os mais simples ganham um significado diferente quando estou contigo. Eu amo como você se preocupa comigo, como demonstra carinho nos detalhes, como cuida de mim com tanto amor. É algo que nunca senti antes, e eu me sinto muito sortudo por ter encontrado alguém como você. Mesmo eu sendo mais quietinho às vezes, quero me abrir cada vez mais, porque contigo eu me sinto seguro, feliz e muito muito apaixonado. Você me faz querer ser melhor, me faz sorrir à toa, e eu amo passar meu tempo com você. Estou muito feliz com o rumo que as coisas estão tomando entre a gente, quero continuar descobrindo tudo sobre você, entender seus jeitos, seus gostos, seus pensamentos, e compartilhar os meus também. Estar contigo é uma das melhores coisas que já me aconteceu, e eu não trocaria isso por nada nesse mundo.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  O
                </motion.div>
                <span className="font-medium text-gray-700">Oliver, o sortudinho</span>
              </div>
              <motion.span 
                className="text-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💜
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Contador de tempo juntos */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Contando cada momento{' '}
            <motion.span 
              className="inline-block"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              💜
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Desde o dia que nos conhecemos, cada segundinho ao seu lado é muuuito incrível
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCounter 
              value={timeElapsed.months} 
              label="Meses" 
              icon={<Calendar size={20} />} 
            />
            <AnimatedCounter 
              value={timeElapsed.days} 
              label="Dias" 
              icon={<Clock size={20} />} 
            />
            <AnimatedCounter 
              value={timeElapsed.hours} 
              label="Horas" 
              icon={<Star size={20} />} 
            />
          </div>
        </div>
      </section>
      
      {/* Seção Final */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-8 text-gray-800"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Um novo capítulo{' '}
            <motion.span 
              className="inline-block"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 mb-12 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Você é tudo o que eu sempre sonhei, com o jeitinho mais perfeito do mundo pra mim. E eu só quero continuar construindo isso ao seu lado, dia após dia.
          </motion.p>
          
          <motion.button
            onClick={() => setShowProposal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 10px 20px rgba(147, 51, 234, 0.3)",
                "0 15px 30px rgba(236, 72, 153, 0.4)",
                "0 10px 20px rgba(147, 51, 234, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <HeartHandshake className="inline-block mr-2" size={24} />
            Clica aqui meu amorzinho
          </motion.button>
        </motion.div>
      </section>
      
      {/* Modal de proposta */}
      <AnimatePresence>
        {showProposal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 max-w-lg w-full relative overflow-hidden"
              initial={{ scale: 0.5, opacity: 0, rotateX: -180 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateX: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 opacity-50"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div 
                className="text-6xl text-center mb-6 relative z-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💜
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Luiza, você aceita namorar comigo?
              </motion.h2>
              
              <motion.p 
                className="text-gray-600 text-center mb-8 relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Quero oficializar nosso amoor, te chamar de namorada, continuar sempreee ao seu ladinhoo
              </motion.p>
              
              <div className="flex justify-center gap-4 relative z-10">
                <motion.button
                  onClick={() => {
                    setShowProposal(false);
                    setShowCelebration(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Sim!
                </motion.button>
                
                <motion.button
                  onMouseEnter={handleNoHover}
                  style={{
                    position: noButtonMoves > 0 ? 'absolute' : 'relative',
                    left: `${noButtonPosition.x}px`,
                    top: `${noButtonPosition.y}px`,
                  }}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 0.9 }}
                >
                  {noButtonText}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Celebração */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetes animados */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(100)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-10"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#9333ea', '#ec4899', '#a855f7', '#c084fc', '#f472b6'][Math.floor(Math.random() * 5)],
                  }}
                  initial={{ 
                    y: -100,
                    x: 0,
                    rotate: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    x: (Math.random() - 0.5) * 200,
                    rotate: Math.random() * 720,
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 3,
                    delay: Math.random() * 0.5,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
            
            <motion.div 
              className="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                duration: 0.8,
                bounce: 0.4
              }}
            >
              <motion.div 
                className="text-6xl text-center mb-6"
                animate={{ 
                  scale: [1, 1.5, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              >
                💜
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                NICEEEEE SOMOS NAMORADOS ÓOO!
              </motion.h2>
              
              <motion.p 
                className="text-gray-600 text-center mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Quero sempre ver você feliz meu amorzinho, te amo demaissssss! 💜
              </motion.p>
              
              <motion.button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Heart className="inline-block mr-2" size={20} />
                Ti amoo minha vidaaaa!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RomanticPage;