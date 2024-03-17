export const ButtonFlickeringLight = () => {
  return (
    <>
      <button>
        <div className="light" />
        Beta Registration
      </button>
      <style jsx>{`
        button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.25rem;
          border-radius: 12px;
          background-color: #111111;
          color: #eeeeee;
        }

        button:hover .light:before {
          box-shadow: 0 0 80px 30px #006fee;
          opacity: 0.8;
        }

        .light {
          z-index: -1;
        }

        .light:before {
          border-radius: 12px;
          transition: 0.8s cubic-bezier(0.075, 0.82, 0.165, 1);
          content: "";
          position: absolute;
          z-index: -1;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          transform: scale(1);
          animation: flickering-light 4s infinite;
          box-shadow: 0 0 60px 10px #006fee;
          opacity: 0.4;
        }

        @keyframes flickering-light {
          0% {
            opacity: 0.4;
          }
          25% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
          75% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.4;
          }
        }
      `}</style>
    </>
  );
};
