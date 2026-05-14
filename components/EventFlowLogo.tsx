import React from 'react';

interface EventFlowLogoProps {
  size?: number;
  variant?: 'full' | 'icon-only' | 'dark' | 'transparent';
  animated?: boolean;
  className?: string;
}

export const EventFlowLogo: React.FC<EventFlowLogoProps> = ({
  size = 200,
  variant = 'full',
  animated = true,
  className = '',
}) => {
  const animationClass = animated ? 'animate-spin-slow' : '';

  const styles = `
    @keyframes spin-slow {
      from { transform: rotateX(0deg) rotateY(0deg); }
      to { transform: rotateX(360deg) rotateY(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 20s linear infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    @keyframes glow {
      0%, 100% { opacity: 0.3; filter: blur(2px); }
      50% { opacity: 0.6; filter: blur(8px); }
    }
    .animate-glow {
      animation: glow 3s ease-in-out infinite;
    }
  `;

  // Full Logo Version
  if (variant === 'full') {
    return (
      <>
        <style>{styles}</style>
        <div
          style={{
            width: size,
            height: size,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1200px',
            background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 60%)',
            borderRadius: '40px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            boxShadow: `inset 0 0 60px rgba(168, 85, 247, 0.1), 0 0 100px rgba(168, 85, 247, 0.15), 0 20px 60px rgba(0, 0, 0, 0.3)`,
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
          }}
          className={className}
        >
          <div
            style={{
              width: size * 0.66,
              height: size * 0.66,
              position: 'relative',
            }}
            className={animationClass}
          >
            {/* Background glow */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)',
                borderRadius: '30px',
                filter: 'blur(2px)',
                opacity: 0.3,
              }}
              className="animate-glow"
            />

            {/* Circles */}
            <div
              style={{
                position: 'absolute',
                width: '150px',
                height: '150px',
                top: '25px',
                left: '25px',
                border: '3px solid #a855f7',
                borderRadius: '50%',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.2)',
                animation: 'spin 6s linear infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '110px',
                height: '110px',
                top: '45px',
                left: '45px',
                border: '3px solid #ec4899',
                borderRadius: '50%',
                boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)',
                animation: 'spin 8s linear infinite reverse',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '70px',
                height: '70px',
                top: '65px',
                left: '65px',
                border: '3px solid #06b6d4',
                borderRadius: '50%',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)',
                animation: 'spin 10s linear infinite',
              }}
            />
          </div>
        </div>
      </>
    );
  }

  // Icon Only Version
  if (variant === 'icon-only') {
    return (
      <>
        <style>{styles}</style>
        <div
          style={{
            width: size,
            height: size,
            background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
            borderRadius: '35px',
            border: '1px solid rgba(168, 85, 247, 0.15)',
            boxShadow: 'inset 0 0 50px rgba(168, 85, 247, 0.08), 0 0 80px rgba(168, 85, 247, 0.1)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          className={className}
        >
          <div
            style={{
              fontSize: size * 0.45,
              fontWeight: 900,
              letterSpacing: '-5px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))',
            }}
            className="animate-float"
          >
            E
          </div>
        </div>
      </>
    );
  }

  // Dark Background Version
  if (variant === 'dark') {
    return (
      <>
        <style>{styles}</style>
        <div
          style={{
            width: size,
            height: size,
            background: '#000',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.2), inset 0 0 60px rgba(168, 85, 247, 0.05)',
          }}
          className={className}
        >
          <div
            style={{
              width: size * 0.66,
              height: size * 0.66,
              position: 'relative',
            }}
            className={animationClass}
          >
            <div
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                top: '10px',
                left: '10px',
                border: '2px solid #a855f7',
                borderRadius: '50%',
                boxShadow: '0 0 20px #a855f7, inset 0 0 20px rgba(168, 85, 247, 0.2), 0 0 40px rgba(168, 85, 247, 0.3)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                top: '40px',
                left: '40px',
                border: '2px solid #ec4899',
                borderRadius: '50%',
                boxShadow: '0 0 25px #ec4899, inset 0 0 15px rgba(236, 72, 153, 0.2)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '60px',
                height: '60px',
                top: '70px',
                left: '70px',
                border: '2px solid #06b6d4',
                borderRadius: '50%',
                boxShadow: '0 0 30px #06b6d4, inset 0 0 10px rgba(6, 182, 212, 0.2)',
              }}
            />
          </div>
        </div>
      </>
    );
  }

  // Transparent Version
  if (variant === 'transparent') {
    return (
      <>
        <style>{styles}</style>
        <div
          style={{
            width: size,
            height: size,
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
          className={className}
        >
          <div
            style={{
              width: size * 0.66,
              height: size * 0.66,
              position: 'relative',
            }}
            className={animationClass}
          >
            <div
              style={{
                position: 'absolute',
                width: '160px',
                height: '160px',
                top: '20px',
                left: '20px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #a855f7 0deg, #ec4899 120deg, #06b6d4 240deg, #a855f7 360deg)',
                filter: 'blur(1px)',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
                animation: 'spin 8s linear infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '110px',
                height: '110px',
                top: '45px',
                left: '45px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #a855f7 0deg, #ec4899 120deg, #06b6d4 240deg, #a855f7 360deg)',
                opacity: 0.7,
                filter: 'blur(1px)',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)',
                animation: 'spin 10s linear infinite reverse',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '60px',
                height: '60px',
                top: '70px',
                left: '70px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #a855f7 0deg, #ec4899 120deg, #06b6d4 240deg, #a855f7 360deg)',
                opacity: 0.5,
                filter: 'blur(1px)',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.15)',
                animation: 'spin 12s linear infinite',
              }}
            />
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default EventFlowLogo;
